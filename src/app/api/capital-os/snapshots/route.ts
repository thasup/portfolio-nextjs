/**
 * CapitalOS — Snapshots API
 * GET /api/capital-os/snapshots  → historical net worth data
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireCapitalOSAuth, isAuthed } from "@/lib/capital-os/auth";

export async function GET(req: NextRequest) {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;

  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 90), 365);

  const snapshots = await prisma.capitalSnapshot.findMany({
    where: { userId: auth.session.userId },
    orderBy: { date: "desc" },
    take: limit,
  });

  return NextResponse.json({
    snapshots: snapshots.reverse().map((s) => ({
      ...s,
      netWorth: Number(s.netWorth),
      liquid: Number(s.liquid),
      invested: Number(s.invested),
      liabilities: Number(s.liabilities),
    })),
  });
}
