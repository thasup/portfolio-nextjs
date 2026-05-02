/**
 * CapitalOS Airtable Sync History API
 *
 * GET - Get sync history for the user
 */

import { NextResponse } from "next/server";
import { requireCapitalOSAuth, isAuthed } from "@/lib/capital-os/auth";
import { getSyncHistory } from "@/lib/capital-os/syncEngine-airtable";
import { prisma } from "@/lib/db/prisma";

// GET /api/capital-os/airtable/sync-history
export async function GET() {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;

  const userId = auth.session.userId;

  try {
    // Get sync run history
    const history = await getSyncHistory(userId, 20);

    // Get the active config
    const config = await prisma.capitalAirtableConfig.findFirst({
      where: { userId, isActive: true },
      select: { id: true, lastSyncAt: true, lastError: true },
    });

    return NextResponse.json({
      configured: !!config,
      lastSyncAt: config?.lastSyncAt?.toISOString() ?? null,
      lastError: config?.lastError ?? null,
      history: history.map((h) => ({
        syncRunId: h.syncRunId,
        timestamp: h.timestamp?.toISOString() ?? null,
        recordCount: h.recordCount,
      })),
    });
  } catch (error) {
    console.error("[CapitalOS] Failed to get sync history:", error);
    return NextResponse.json(
      { error: "Failed to retrieve sync history" },
      { status: 500 },
    );
  }
}
