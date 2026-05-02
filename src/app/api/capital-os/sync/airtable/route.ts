import { NextResponse } from "next/server";
import { requireCapitalOSAuth, isAuthed } from "@/lib/capital-os/auth";
import { executeAirtableSync } from "@/lib/capital-os/syncEngine";

export async function POST() {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;

  const userId = auth.session.userId;

  try {
    const result = await executeAirtableSync(userId);

    return NextResponse.json({
      success: true,
      syncedAccounts: result.syncedAccounts,
      syncedLiabilities: result.syncedLiabilities,
      syncedGoals: result.syncedGoals,
      message: "Airtable sync complete",
    });
  } catch (error) {
    console.error("[CapitalOS] Airtable sync failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sync failed" },
      { status: 500 },
    );
  }
}
