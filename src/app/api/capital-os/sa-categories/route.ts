/**
 * CapitalOS SA Categories API
 * GET: Fetch user's SA category structure
 * POST: Create new category
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { CapitalPortfolioType } from "@prisma/client";
import { requireCapitalOSAuth, isAuthed } from "@/lib/capital-os/auth";

export async function GET(request: NextRequest) {
  const authResult = await requireCapitalOSAuth();
  if (!isAuthed(authResult)) {
    return authResult;
  }
  const { session } = authResult;
  const userId = session.user.id;

  try {
    const categories = await prisma.capitalSACategory.findMany({
      where: { userId },
      orderBy: [
        { portfolioType: "asc" },
        { sortOrder: "asc" },
        { name: "asc" },
      ],
      include: {
        assets: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    // Group by portfolio type
    const grouped = {
      strategic: categories.filter((c) => c.portfolioType === CapitalPortfolioType.STRATEGIC),
      tactical: categories.filter((c) => c.portfolioType === CapitalPortfolioType.TACTICAL),
    };

    return NextResponse.json(grouped);
  } catch (error) {
    console.error("Failed to fetch SA categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
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
    const { portfolioType, name, targetPct, sortOrder } = body;

    if (!portfolioType || !name) {
      return NextResponse.json(
        { error: "portfolioType and name are required" },
        { status: 400 }
      );
    }

    const category = await prisma.capitalSACategory.create({
      data: {
        userId,
        portfolioType: portfolioType as CapitalPortfolioType,
        name,
        targetPct: targetPct ? Number(targetPct) : null,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Failed to create SA category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
