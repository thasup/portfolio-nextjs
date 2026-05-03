/**
 * CapitalOS — Liabilities API
 * GET  /api/capital-os/liabilities  → list user's liabilities
 * POST /api/capital-os/liabilities  → create a new liability
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireCapitalOSAuth, isAuthed } from "@/lib/capital-os/auth";

export async function GET() {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;

  const liabilities = await prisma.capitalLiability.findMany({
    where: { userId: auth.session.userId, archivedAt: null },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({
    success: true,
    data: {
      liabilities: liabilities.map((l) => ({
        ...l,
        balance: Number(l.balance),
        apr: l.apr ? Number(l.apr) : null,
      })),
    },
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;

  const body = await req.json();
  const { name, balance, apr, icon, color } = body;

  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const liability = await prisma.capitalLiability.create({
    data: {
      userId: auth.session.userId,
      name,
      balance: BigInt(balance ?? 0),
      apr: apr ?? null,
      icon: icon ?? null,
      color: color ?? null,
    },
  });

  return NextResponse.json(
    {
      success: true,
      data: {
        ...liability,
        balance: Number(liability.balance),
        apr: liability.apr ? Number(liability.apr) : null,
      },
    },
    { status: 201 },
  );
}
