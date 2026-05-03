/**
 * CapitalOS Mapping Configuration API
 * GET: Fetch user's YNAB → SA mapping configuration
 * POST: Bulk update mapping configuration
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { CapitalMappingRole } from "@prisma/client";
import { requireCapitalOSAuth, isAuthed } from "@/lib/capital-os/auth";

export async function GET(request: NextRequest) {
  const authResult = await requireCapitalOSAuth();
  if (!isAuthed(authResult)) {
    return authResult;
  }
  const { session } = authResult;
  const userId = session.user.id;

  try {
    const mapping = await prisma.capitalMappingConfig.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(
      mapping.map((m) => {
        const raw = m as any;
        return {
          id: m.id,
          ynabAccId: m.ynabAccId,
          role: m.role,
          note: m.note,
          saAssetMappings: (raw.saAssetMappings as { saTicker: string }[] | null) ?? [],
        };
      })
    );
  } catch (error) {
    console.error("Failed to fetch mapping config:", error);
    return NextResponse.json(
      { error: "Failed to fetch mapping" },
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
    const { mappings } = body as {
      mappings: Array<{
        ynabAccId: string;
        role: CapitalMappingRole;
        saAssetMappings?: { saTicker: string }[];
        note?: string;
      }>;
    };

    if (!Array.isArray(mappings)) {
      return NextResponse.json(
        { error: "mappings array is required" },
        { status: 400 }
      );
    }

    const results = await prisma.$transaction(
      mappings.map((m) =>
        (prisma.capitalMappingConfig.upsert as any)({
          where: { userId_ynabAccId: { userId, ynabAccId: m.ynabAccId } },
          update: {
            role: m.role,
            saAssetMappings: m.saAssetMappings ?? [],
            note: m.note || null,
          },
          create: {
            userId,
            ynabAccId: m.ynabAccId,
            role: m.role,
            saAssetMappings: m.saAssetMappings ?? [],
            note: m.note || null,
          },
        })
      )
    );

    return NextResponse.json({ success: true, count: results.length });
  } catch (error) {
    console.error("Failed to update mapping config:", error);
    return NextResponse.json(
      { error: "Failed to update mapping" },
      { status: 500 }
    );
  }
}
