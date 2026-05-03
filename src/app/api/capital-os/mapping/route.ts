/**
 * CapitalOS Mapping Configuration API
 * GET: Fetch user's YNAB → SA mapping configuration
 * POST: Bulk update mapping configuration
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireCapitalOSAuth, isAuthed } from "@/lib/capital-os/auth";
import {
  MappingConfigRequestSchema,
  validateRequest,
  ValidationError,
  formatValidationError,
  SAAssetMappingsArraySchema,
  type SAAssetMappingsArray,
} from "@/lib/capital-os/schemas";

export async function GET(request: NextRequest) {
  const authResult = await requireCapitalOSAuth();
  if (!isAuthed(authResult)) {
    return authResult;
  }
  const { session } = authResult;
  const userId = session.user.id;

  try {
    const mappings = await prisma.capitalMappingConfig.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    // Parse and validate JSONB data with runtime type safety
    const validatedMappings = mappings.map((m) => {
      const saAssetMappings = SAAssetMappingsArraySchema.parse(
        m.saAssetMappings ?? []
      );

      return {
        id: m.id,
        ynabAccId: m.ynabAccId,
        role: m.role,
        note: m.note,
        saAssetMappings,
      };
    });

    return NextResponse.json({
      success: true,
      data: validatedMappings,
    });
  } catch (error) {
    console.error("[CapitalOS] Failed to fetch mapping config:", {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch mapping configuration",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireCapitalOSAuth();
  if (!isAuthed(authResult)) {
    return authResult;
  }
  const { session } = authResult;
  const userId = session.user.id;

  try {
    const body = await request.json();

    // Validate request body with Zod schema
    const validatedData = validateRequest(MappingConfigRequestSchema, body);
    const { mappings } = validatedData;

    // Perform bulk upsert in transaction
    const results = await prisma.$transaction(
      mappings.map((m) =>
        prisma.capitalMappingConfig.upsert({
          where: {
            userId_ynabAccId: {
              userId,
              ynabAccId: m.ynabAccId,
            },
          },
          update: {
            role: m.role,
            saAssetMappings: m.saAssetMappings,
            note: m.note || null,
          },
          create: {
            userId,
            ynabAccId: m.ynabAccId,
            role: m.role,
            saAssetMappings: m.saAssetMappings,
            note: m.note || null,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      data: { count: results.length },
    });
  } catch (error) {
    console.error("[CapitalOS] Failed to update mapping config:", {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });

    // Handle validation errors with detailed feedback
    if (error instanceof ValidationError) {
      return NextResponse.json(formatValidationError(error), { status: 400 });
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update mapping configuration",
      },
      { status: 500 }
    );
  }
}
