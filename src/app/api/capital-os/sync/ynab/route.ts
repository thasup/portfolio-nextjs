/**
 * CapitalOS — YNAB Sync API
 * POST /api/capital-os/sync/ynab  → fetch YNAB accounts → upsert into DB
 *
 * This is the core data pipeline:
 * 1. Fetch accounts from YNAB API
 * 2. Upsert each account into capital_accounts (matched by externalId)
 * 3. Record a snapshot of the current net worth
 */
import { NextResponse } from "next/server";
import { requireCapitalOSAuth, isAuthed } from "@/lib/capital-os/auth";
import { executeYnabSync } from "@/lib/capital-os/syncEngine";

export async function POST() {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;

  const userId = auth.session.userId;

  try {
    const result = await executeYnabSync(userId);
    return NextResponse.json({
      success: true,
      synced: result.synced,
      syncedLiabilities: result.syncedLiabilities,
      message: "YNAB sync complete",
    });
  } catch (error) {
    console.error("[CapitalOS] YNAB sync failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sync failed" },
      { status: 500 },
    );
  }
}
