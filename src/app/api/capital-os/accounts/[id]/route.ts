/**
 * CapitalOS — Single Account API
 * PATCH  /api/capital-os/accounts/[id]  → update account
 * DELETE /api/capital-os/accounts/[id]  → soft-delete (archive)
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireCapitalOSAuth, isAuthed } from "@/lib/capital-os/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;
  const { id } = await ctx.params;

  const existing = await prisma.capitalAccount.findFirst({
    where: { id, userId: auth.session.userId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const body = await req.json();
  const { name, balance, type, icon, color } = body;

  const account = await prisma.capitalAccount.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(balance !== undefined && { balance: BigInt(balance) }),
      ...(type !== undefined && { type }),
      ...(icon !== undefined && { icon }),
      ...(color !== undefined && { color }),
    },
  });

  return NextResponse.json({
    account: { ...account, balance: Number(account.balance) },
  });
}

export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;
  const { id } = await ctx.params;

  const existing = await prisma.capitalAccount.findFirst({
    where: { id, userId: auth.session.userId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  await prisma.capitalAccount.update({
    where: { id },
    data: { archivedAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
