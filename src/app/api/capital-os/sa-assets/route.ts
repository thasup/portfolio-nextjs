/**
 * CapitalOS SA Assets API
 * GET: Fetch user's SA assets
 * POST: Create new asset
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireCapitalOSAuth, isAuthed } from "@/lib/capital-os/auth";

export async function GET(request: NextRequest) {
  const authResult = await requireCapitalOSAuth();
  if (!isAuthed(authResult)) {
    return authResult;
  }
  const { session } = authResult;
  const userId = session.user.id;

  try {
    const assets = await prisma.capitalSAAsset.findMany({
      where: {
        category: {
          userId,
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(assets);
  } catch (error) {
    console.error("Failed to fetch SA assets:", error);
    return NextResponse.json(
      { error: "Failed to fetch assets" },
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
    const { categoryId, ticker, name, valueThb, shares, targetPct, sortOrder } = body;

    if (!categoryId || !ticker || !name) {
      return NextResponse.json(
        { error: "categoryId, ticker, and name are required" },
        { status: 400 }
      );
    }

    // Verify category belongs to user
    const category = await prisma.capitalSACategory.findFirst({
      where: { id: categoryId, userId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const asset = await prisma.capitalSAAsset.create({
      data: {
        categoryId,
        ticker,
        name,
        valueThb: valueThb ? BigInt(Math.round(valueThb * 100)) : null, // Convert THB to satangs
        shares: shares ? String(shares) : null,
        targetPct: targetPct ? Number(targetPct) : null,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    console.error("Failed to create SA asset:", error);
    return NextResponse.json(
      { error: "Failed to create asset" },
      { status: 500 }
    );
  }
}
