import { NextRequest, NextResponse } from "next/server";
import { requireCapitalOSAuth, isAuthed } from "@/lib/capital-os/auth";
import {
  executeAirtableSync,
  previewAirtableSync,
} from "@/lib/capital-os/syncEngine-airtable";
import { hasAirtableConfig } from "@/lib/capital-os/airtable-config";

/**
 * POST /api/capital-os/sync/airtable
 *
 * Body: { preview?: boolean }
 *
 * If preview is true, returns sample of what would be synced without modifying data.
 * Otherwise, performs full sync and stores snapshots.
 */
export async function POST(request: NextRequest) {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;

  const userId = auth.session.userId;

  try {
    // Check if user has configuration
    const isConfigured = await hasAirtableConfig(userId);
    if (!isConfigured) {
      return NextResponse.json(
        {
          error: "Airtable not configured",
          code: "CONFIG_MISSING",
          message:
            "Please configure your Airtable base and tables in Settings first.",
        },
        { status: 400 },
      );
    }

    // Check if this is a preview request
    const body = await request.json().catch(() => ({}));
    const isPreview = body?.preview === true;

    if (isPreview) {
      // Return preview of what would be synced
      const preview = await previewAirtableSync(userId);
      return NextResponse.json({
        preview: true,
        data: preview,
      });
    }

    // Perform actual sync
    const result = await executeAirtableSync(userId);

    return NextResponse.json({
      success: true,
      syncedAccounts: result.syncedAccounts,
      syncedLiabilities: result.syncedLiabilities,
      syncedGoals: result.syncedGoals,
      snapshotCount: result.snapshotCount,
      errors: result.errors.length > 0 ? result.errors : undefined,
      message:
        result.errors.length > 0
          ? `Sync completed with ${result.errors.length} warning(s)`
          : "Airtable sync complete",
    });
  } catch (error) {
    console.error("[CapitalOS] Airtable sync failed:", error);

    // Return specific error codes for common issues
    const errorMessage = error instanceof Error ? error.message : "Sync failed";
    const errorCode = errorMessage.includes("API key")
      ? "API_KEY_MISSING"
      : errorMessage.includes("configuration")
        ? "CONFIG_ERROR"
        : "SYNC_FAILED";

    return NextResponse.json(
      {
        error: errorMessage,
        code: errorCode,
      },
      { status: 500 },
    );
  }
}
