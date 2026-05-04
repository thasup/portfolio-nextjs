/**
 * CapitalOS — Snapshots API
 * GET  /api/capital-os/snapshots  → historical net worth data
 * POST /api/capital-os/snapshots  → create SA snapshot
 */
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireCapitalOSAuth, isAuthed } from "@/lib/capital-os/auth";

export async function GET(req: NextRequest) {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;

  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 90), 365);

  const snapshots = await prisma.capitalSnapshot.findMany({
    where: { userId: auth.session.userId },
    orderBy: { date: "desc" },
    take: limit,
  });

  return NextResponse.json({
    success: true,
    data: {
      snapshots: snapshots.reverse().map((s) => ({
        id: s.id,
        userId: s.userId,
        date: s.date.toISOString(),
        createdAt: s.createdAt.toISOString(),

        netWorth: Number(s.netWorth),
        liquid: Number(s.liquid),
        invested: Number(s.invested),
        liabilities: Number(s.liabilities),

        saTotal: s.saTotal != null ? Number(s.saTotal) : null,
        saPortfolios: s.saPortfolios ?? null,
        saAssets: s.saAssets ?? null,
        fxRateUsdThb: s.fxRateUsdThb != null ? Number(s.fxRateUsdThb) : null,
      })),
    },
  });
}

/**
 * POST /api/capital-os/snapshots
 * Body: {
 *   fxRateUsdThb: number,
 *   saTotal: number (in satangs),
 *   saPortfolios: { strategic: { total }, tactical: { total } },
 *   assets: [{ ticker, name, investedValue, currentValue, shares, currency, categoryId }]
 * }
 */
export async function POST(req: NextRequest) {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;

  try {
    const body = await req.json();
    const { fxRateUsdThb, saTotal, saPortfolios, assets } = body;

    // Validate required fields
    if (typeof fxRateUsdThb !== "number" || typeof saTotal !== "number") {
      return NextResponse.json(
        { error: "Missing required fields: fxRateUsdThb, saTotal" },
        { status: 400 }
      );
    }

    // Build saAssets from payload - stores full asset-level snapshot data
    type AssetPayload = { ticker?: string; name?: string; categoryId?: string; investedValue?: number | null; investedValueThb?: number | null; currentValue?: number | null; valueThb?: number | null; currency?: string; shares?: number | null };
    const saAssets = Array.isArray(assets)
      ? assets.map((a: AssetPayload) => ({
          ticker: a.ticker || "",
          name: a.name || "",
          categoryId: a.categoryId || "",
          investedValue: a.investedValue ?? a.investedValueThb ?? null, // cost basis (satangs)
          currentValue: a.currentValue ?? a.valueThb ?? null, // market value (satangs)
          currency: a.currency || "THB",
          shares: a.shares != null ? String(a.shares) : null,
        }))
      : [];

    // Upsert the SA snapshot (update if exists for today, create if not)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const snapshot = await prisma.capitalSnapshot.upsert({
      where: {
        userId_date: {
          userId: auth.session.userId,
          date: today,
        },
      },
      update: {
        netWorth: BigInt(saTotal),
        liquid: BigInt(0),
        invested: BigInt(saTotal),
        liabilities: BigInt(0),
        saTotal: BigInt(saTotal),
        saPortfolios: saPortfolios as Prisma.InputJsonValue,
        saAssets: saAssets as Prisma.InputJsonValue,
        fxRateUsdThb,
      },
      create: {
        userId: auth.session.userId,
        date: today,
        netWorth: BigInt(saTotal),
        liquid: BigInt(0),
        invested: BigInt(saTotal),
        liabilities: BigInt(0),
        saTotal: BigInt(saTotal),
        saPortfolios: saPortfolios as Prisma.InputJsonValue,
        saAssets: saAssets as Prisma.InputJsonValue,
        fxRateUsdThb,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: snapshot.id,
        date: snapshot.date,
        netWorth: Number(snapshot.netWorth),
        saTotal: Number(snapshot.saTotal),
        fxRateUsdThb: snapshot.fxRateUsdThb,
        saPortfolios: snapshot.saPortfolios,
        saAssets: snapshot.saAssets,
      },
    });
  } catch (error) {
    console.error("Failed to create snapshot:", error);
    return NextResponse.json(
      { error: "Failed to create snapshot" },
      { status: 500 }
    );
  }
}
