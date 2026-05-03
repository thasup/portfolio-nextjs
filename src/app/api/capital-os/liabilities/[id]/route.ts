/**
 * CapitalOS — Single Liability API
 * PATCH  /api/capital-os/liabilities/[id]  → update
 * DELETE /api/capital-os/liabilities/[id]  → soft-delete
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireCapitalOSAuth, isAuthed } from "@/lib/capital-os/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;
  const { id } = await ctx.params;

  const existing = await prisma.capitalLiability.findFirst({
    where: { id, userId: auth.session.userId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Liability not found" }, { status: 404 });
  }

  const body = await req.json();
  const { name, balance, apr, icon, color } = body;

  const liability = await prisma.capitalLiability.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(balance !== undefined && { balance: BigInt(balance) }),
      ...(apr !== undefined && { apr }),
      ...(icon !== undefined && { icon }),
      ...(color !== undefined && { color }),
    },
  });

  return NextResponse.json({
    success: true,
    data: {
      ...liability,
      balance: Number(liability.balance),
      apr: liability.apr ? Number(liability.apr) : null,
    },
  });
}

export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;
  const { id } = await ctx.params;

  const existing = await prisma.capitalLiability.findFirst({
    where: { id, userId: auth.session.userId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Liability not found" }, { status: 404 });
  }

  await prisma.capitalLiability.update({
    where: { id },
    data: { archivedAt: new Date() },
  });

  return NextResponse.json({ success: true, data: { archived: true } });
}
