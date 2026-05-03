/**
 * CapitalOS Airtable Configuration API
 *
 * GET  - Get current Airtable configuration for the user
 * POST - Create or update Airtable configuration
 * DELETE - Remove Airtable configuration
 */

import { NextRequest, NextResponse } from "next/server";
import { requireCapitalOSAuth, isAuthed } from "@/lib/capital-os/auth";
import {
  getAirtableConfig,
  upsertAirtableConfig,
  hasAirtableConfig,
  DEFAULT_FIELD_MAPPINGS,
  DEFAULT_TABLE_NAMES,
  type CapitalAirtableEntityType,
} from "@/lib/capital-os/airtable-config";
import { prisma } from "@/lib/db/prisma";

// GET /api/capital-os/airtable/config
export async function GET() {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;

  const userId = auth.session.userId;

  try {
    const config = await getAirtableConfig(userId);

    if (!config) {
      return NextResponse.json({
        configured: false,
        config: null,
      });
    }

    return NextResponse.json({
      configured: true,
      config: {
        id: config.id,
        baseId: config.baseId,
        name: config.name,
        isActive: config.isActive,
        tables: config.tables.map((t) => ({
          id: t.id,
          entityType: t.entityType,
          tableName: t.tableName,
          isEnabled: t.isEnabled,
          fieldMap: t.fieldMap,
          filterFormula: t.filterFormula,
        })),
      },
    });
  } catch (error) {
    console.error("[CapitalOS] Failed to get Airtable config:", error);
    return NextResponse.json(
      { error: "Failed to retrieve configuration" },
      { status: 500 },
    );
  }
}

// POST /api/capital-os/airtable/config
export async function POST(request: NextRequest) {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;

  const userId = auth.session.userId;

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.baseId) {
      return NextResponse.json(
        { error: "baseId is required" },
        { status: 400 },
      );
    }

    if (!body.tables || !Array.isArray(body.tables) || body.tables.length === 0) {
      return NextResponse.json(
        { error: "At least one table configuration is required" },
        { status: 400 },
      );
    }

    // Validate table configurations
    const validEntityTypes: CapitalAirtableEntityType[] = [
      "ACCOUNTS",
      "LIABILITIES",
      "GOALS",
      "SNAPSHOTS",
      "HOLDINGS",
    ];

    for (const table of body.tables) {
      if (!table.entityType || !validEntityTypes.includes(table.entityType)) {
        return NextResponse.json(
          { error: `Invalid entity type: ${table.entityType}` },
          { status: 400 },
        );
      }
      if (!table.tableName || typeof table.tableName !== "string") {
        return NextResponse.json(
          { error: "tableName is required for each table" },
          { status: 400 },
        );
      }
    }

    // Create the configuration
    const config = await upsertAirtableConfig(userId, {
      baseId: body.baseId,
      name: body.name || "My Airtable Base",
      isActive: body.isActive ?? true,
      tables: body.tables.map((t: { entityType: CapitalAirtableEntityType; tableName: string; customTitle?: string | null; customDescription?: string | null; isEnabled?: boolean; fieldMap?: Record<string, string>; filterFormula?: string }) => ({
        entityType: t.entityType,
        tableName: t.tableName,
        customTitle: t.customTitle ?? null,
        customDescription: t.customDescription ?? null,
        isEnabled: t.isEnabled ?? true,
        fieldMap: t.fieldMap || DEFAULT_FIELD_MAPPINGS[t.entityType],
        filterFormula: t.filterFormula,
      })),
    });

    return NextResponse.json({
      success: true,
      config: {
        id: config.id,
        baseId: config.baseId,
        name: config.name,
        isActive: config.isActive,
        tables: config.tables,
      },
    });
  } catch (error) {
    console.error("[CapitalOS] Failed to save Airtable config:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save configuration" },
      { status: 500 },
    );
  }
}

// DELETE /api/capital-os/airtable/config
export async function DELETE() {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;

  const userId = auth.session.userId;

  try {
    // Deactivate all configs instead of deleting (preserves history)
    await prisma.capitalAirtableConfig.updateMany({
      where: { userId },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: "Airtable configuration deactivated",
    });
  } catch (error) {
    console.error("[CapitalOS] Failed to deactivate Airtable config:", error);
    return NextResponse.json(
      { error: "Failed to deactivate configuration" },
      { status: 500 },
    );
  }
}
