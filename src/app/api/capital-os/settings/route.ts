/**
 * CapitalOS — Settings API
 * GET   /api/capital-os/settings  → get user's settings
 * PATCH /api/capital-os/settings  → update user's settings
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireCapitalOSAuth, isAuthed } from "@/lib/capital-os/auth";
import {
  SettingsRequestSchema,
  validateRequest,
  ValidationError,
  formatValidationError,
} from "@/lib/capital-os/schemas";

export async function GET() {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;
  const userId = auth.session.user.id;

  try {
    let settings = await prisma.capitalSettings.findUnique({
      where: { userId },
    });

    // If no settings exist, create default ones
    if (!settings) {
      settings = await prisma.capitalSettings.create({
        data: {
          userId,
          runwayBurnRate: BigInt(2500000), // 25,000 THB default
          runwayAccountIds: [],
          preferredCurrency: "THB",
          numberFormat: "en-US",
          dateFormat: "YYYY-MM-DD",
          theme: "dark",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: settings.userId,
        runwayBurnRate: Number(settings.runwayBurnRate),
        runwayAccountIds: settings.runwayAccountIds,
        preferredCurrency: settings.preferredCurrency,
        numberFormat: settings.numberFormat,
        dateFormat: settings.dateFormat,
        theme: settings.theme,
        fxRatesUpdatedAt: settings.fxRatesUpdatedAt?.toISOString() || null,
        updatedAt: settings.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[CapitalOS] Failed to fetch settings:", {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch settings",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;
  const userId = auth.session.user.id;

  try {
    const body = await req.json();

    // Validate request with Zod schema
    const validated = validateRequest(SettingsRequestSchema, body);

    // Build update data object
    const updateData: Record<string, unknown> = {};
    
    if (validated.runwayBurnRate !== undefined) {
      updateData.runwayBurnRate = validated.runwayBurnRate;
    }
    if (validated.runwayAccountIds !== undefined) {
      updateData.runwayAccountIds = validated.runwayAccountIds;
    }
    if (validated.preferredCurrency !== undefined) {
      updateData.preferredCurrency = validated.preferredCurrency;
    }
    if (validated.numberFormat !== undefined) {
      updateData.numberFormat = validated.numberFormat;
    }
    if (validated.dateFormat !== undefined) {
      updateData.dateFormat = validated.dateFormat;
    }
    if (validated.theme !== undefined) {
      updateData.theme = validated.theme;
    }

    const settings = await prisma.capitalSettings.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        runwayBurnRate: validated.runwayBurnRate ?? BigInt(2500000),
        runwayAccountIds: validated.runwayAccountIds ?? [],
        preferredCurrency: validated.preferredCurrency ?? "THB",
        numberFormat: validated.numberFormat ?? "en-US",
        dateFormat: validated.dateFormat ?? "YYYY-MM-DD",
        theme: validated.theme ?? "dark",
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        userId: settings.userId,
        runwayBurnRate: Number(settings.runwayBurnRate),
        runwayAccountIds: settings.runwayAccountIds,
        preferredCurrency: settings.preferredCurrency,
        numberFormat: settings.numberFormat,
        dateFormat: settings.dateFormat,
        theme: settings.theme,
        fxRatesUpdatedAt: settings.fxRatesUpdatedAt?.toISOString() || null,
        updatedAt: settings.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[CapitalOS] Failed to update settings:", {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });

    // Handle validation errors
    if (error instanceof ValidationError) {
      return NextResponse.json(formatValidationError(error), { status: 400 });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update settings",
      },
      { status: 500 }
    );
  }
}
