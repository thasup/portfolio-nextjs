import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireCapitalOSAuth, isAuthed } from "@/lib/capital-os/auth";

export async function POST(req: NextRequest) {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;

  try {
    const body = await req.json();

    const snapshot = await prisma.capitalSnowballSnapshot.create({
      data: {
        userId: auth.session.userId,
        snapshotDate: body.snapshotDate ? new Date(body.snapshotDate) : new Date(),
        importMethod: body.importMethod || "manual_form",
        totalValueUsd: BigInt(Math.round((Number(body.totalValueUsd) || 0) * 100)),
        totalValueThb: BigInt(Math.round((Number(body.totalValueThb) || 0) * 100)),
        fxRateUsdThb: Number(body.fxRateUsdThb) || 33.47,
        totalProfitUsd: BigInt(Math.round((Number(body.totalProfitUsd) || 0) * 100)),
        totalProfitPct: Number(body.totalProfitPct) || 0,
        irrPct: Number(body.irrPct) || 0,
        passiveIncomeUsd: BigInt(Math.round((Number(body.passiveIncomeUsd) || 0) * 100)),
        passiveYieldPct: Number(body.passiveYieldPct) || 0,
        cashBalanceUsd: body.cashBalanceUsd ? BigInt(Math.round(Number(body.cashBalanceUsd) * 100)) : null,
        
        strategicValueUsd: body.strategicValueUsd ? BigInt(Math.round(Number(body.strategicValueUsd) * 100)) : null,
        strategicAllocPct: body.strategicAllocPct ? Number(body.strategicAllocPct) : null,
        strategicProfitPct: body.strategicProfitPct ? Number(body.strategicProfitPct) : null,
        
        tacticalValueUsd: body.tacticalValueUsd ? BigInt(Math.round(Number(body.tacticalValueUsd) * 100)) : null,
        tacticalAllocPct: body.tacticalAllocPct ? Number(body.tacticalAllocPct) : null,
        tacticalProfitPct: body.tacticalProfitPct ? Number(body.tacticalProfitPct) : null,
      },
    });

    return NextResponse.json(
      { 
        snapshot: { 
          ...snapshot, 
          totalValueUsd: Number(snapshot.totalValueUsd), 
          totalValueThb: Number(snapshot.totalValueThb) 
        } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create Snowball snapshot:", error);
    return NextResponse.json({ error: "Failed to create snapshot" }, { status: 500 });
  }
}
