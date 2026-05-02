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

  await prisma.capitalSyncLog.create({
    data: {
      userId: auth.session.userId,
      source: "MANUAL",
      action: "UPDATE",
      entityType: "ACCOUNT",
      entityId: id,
      before: {
        ...existing,
        balance: Number(existing.balance),
      },
      after: {
        ...account,
        balance: Number(account.balance),
      },
    },
  });

  return NextResponse.json({
    account: { ...account, balance: Number(account.balance) },
  });
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;
  const { id } = await ctx.params;

  const existing = await prisma.capitalAccount.findFirst({
    where: { id, userId: auth.session.userId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  // Check if we are doing an UNDO (restoring)
  const { searchParams } = new URL(req.url);
  const undo = searchParams.get("undo") === "true";

  const updated = await prisma.capitalAccount.update({
    where: { id },
    data: { archivedAt: undo ? null : new Date() },
  });

  await prisma.capitalSyncLog.create({
    data: {
      userId: auth.session.userId,
      source: "MANUAL",
      action: undo ? "RESTORE" : "DELETE",
      entityType: "ACCOUNT",
      entityId: id,
      before: { ...existing, balance: Number(existing.balance) },
      after: { ...updated, balance: Number(updated.balance) },
    },
  });

  return NextResponse.json({ success: true });
}
