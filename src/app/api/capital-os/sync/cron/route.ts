import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import {
  executeYnabSync,
  executeAirtableSync,
} from "@/lib/capital-os/syncEngine";

/**
 * Vercel Cron Job — Daily CapitalOS Sync
 * GET /api/capital-os/sync/cron
 */
export async function GET(req: Request) {
  // Validate Vercel Cron
  const reqHeaders = await headers();
  const authHeader = reqHeaders.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find the primary user (the admin)
  // Since this is a personal app currently, we'll fetch the user with ADMIN role
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!admin) {
    return NextResponse.json(
      { error: "No admin user found." },
      { status: 500 },
    );
  }

  const userId = admin.id;

  try {
    // 1. Trigger YNAB and Airtable via fetch (to keep logic identical and modular)
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || `http://${reqHeaders.get("host")}`;

    // We can't easily fetch our own protected routes because of requireCapitalOSAuth.
    // Instead of duplicating the entire sync engine, let's build the divergence detector
    // logic here, which serves as M1.3.

    // Calculate Before state
    const beforeAccounts = await prisma.capitalAccount.findMany({
      where: { userId },
    });
    const beforeTotal = beforeAccounts.reduce(
      (sum, acc) => sum + Number(acc.balance),
      0,
    );

    const [ynabResult, airtableResult] = await Promise.allSettled([
      executeYnabSync(userId),
      executeAirtableSync(userId),
    ]);

    // Calculate After state
    const afterAccounts = await prisma.capitalAccount.findMany({
      where: { userId },
    });
    const afterTotal = afterAccounts.reduce(
      (sum, acc) => sum + Number(acc.balance),
      0,
    );

    // Divergence detection logic
    // We compare beforeTotal and afterTotal. Since YNAB/Airtable sync overwrote our DB,
    // the afterTotal represents the source-of-truth.
    // If the difference is > 5%, it means the DB had drifted significantly from the source.
    if (
      beforeTotal > 0 &&
      Math.abs(afterTotal - beforeTotal) / beforeTotal > 0.05
    ) {
      await prisma.capitalAlert.create({
        data: {
          userId,
          type: "DIVERGENCE",
          severity: "HIGH",
          title: "Significant Sync Divergence",
          message: `Daily sync detected a >5% shift in account balances (Before: ${beforeTotal / 100}, After: ${afterTotal / 100}).`,
        },
      });
    }

    await prisma.capitalSyncLog.create({
      data: {
        userId,
        source: "SYSTEM",
        action: "SYNC",
        entityType: "CRON",
        after: {
          ynabStatus: ynabResult.status,
          airtableStatus: airtableResult.status,
          beforeTotal,
          afterTotal,
        },
      },
    });

    return NextResponse.json({ success: true, message: "Cron executed." });
  } catch (error) {
    console.error("[CapitalOS] Cron failed:", error);
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}
