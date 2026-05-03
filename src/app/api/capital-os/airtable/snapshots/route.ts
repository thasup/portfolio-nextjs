/**
 * API route for fetching Airtable snapshots.
 *
 * GET /api/capital-os/airtable/snapshots
 * Returns paginated list of snapshots grouped by sync run.
 */

import { NextResponse } from "next/server";
import {
  requireCapitalOSAuth,
  isAuthed,
} from "@/lib/capital-os/auth";
import { getSnapshotsByUser } from "@/lib/capital-os/airtable-config";
import type { CapitalAirtableEntityType } from "@prisma/client";

export const dynamic = "force-dynamic";

// GET /api/capital-os/airtable/snapshots
export async function GET(request: Request) {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;

  const userId = auth.session.userId;

  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get("entityType") as CapitalAirtableEntityType | null;
    const configId = searchParams.get("configId");
    const limit = parseInt(searchParams.get("limit") ?? "100", 10);
    const offset = parseInt(searchParams.get("offset") ?? "0", 10);

    const result = await getSnapshotsByUser(userId, {
      entityType: entityType ?? undefined,
      configId: configId ?? undefined,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("[CapitalOS] Failed to fetch snapshots:", error);
    return NextResponse.json(
      { error: "Failed to fetch snapshots" },
      { status: 500 },
    );
  }
}
