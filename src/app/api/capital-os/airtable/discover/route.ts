/**
 * CapitalOS Airtable Table Discovery API
 *
 * GET /api/capital-os/airtable/discover?baseId=appXXXX
 * - Fetches tables from Airtable base using Airtable API
 */

import { NextRequest, NextResponse } from "next/server";
import Airtable from "airtable";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const baseId = searchParams.get("baseId");

  if (!baseId) {
    return NextResponse.json(
      { error: "baseId parameter required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.AIRTABLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Airtable API key not configured" },
      { status: 500 }
    );
  }

  try {
    // Fetch base schema from Airtable API
    const response = await fetch(
      `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `Failed to fetch tables: ${response.status}`);
    }

    const data = await response.json();

    // Map tables to simpler format
    const tables = data.tables.map((table: {
      id: string;
      name: string;
      description?: string;
      primaryFieldId: string;
      fields: Array<{ id: string; name: string; type: string }>;
    }) => ({
      id: table.id,
      name: table.name,
      description: table.description || null,
      fieldCount: table.fields?.length || 0,
      fields: table.fields?.slice(0, 10).map((f: { id: string; name: string; type: string }) => ({
        id: f.id,
        name: f.name,
        type: f.type,
      })) || [],
    }));

    return NextResponse.json({
      baseId,
      baseName: data.name || "Unknown Base",
      tables,
    });
  } catch (error) {
    console.error("[CapitalOS] Failed to discover Airtable tables:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch tables" },
      { status: 500 }
    );
  }
}
