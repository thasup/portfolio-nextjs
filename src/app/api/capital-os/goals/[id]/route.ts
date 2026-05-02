/**
 * CapitalOS — Single Goal API
 * PATCH  /api/capital-os/goals/[id]  → update
 * DELETE /api/capital-os/goals/[id]  → soft-delete
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireCapitalOSAuth, isAuthed } from "@/lib/capital-os/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;
  const { id } = await ctx.params;

  const existing = await prisma.capitalGoal.findFirst({
    where: { id, userId: auth.session.userId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Goal not found" }, { status: 404 });
  }

  const body = await req.json();
  const { name, current, target, deadline, priority, vehicle } = body;

  const goal = await prisma.capitalGoal.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(current !== undefined && { current: BigInt(current) }),
      ...(target !== undefined && { target: BigInt(target) }),
      ...(deadline !== undefined && {
        deadline: deadline ? new Date(deadline) : null,
      }),
      ...(priority !== undefined && { priority }),
      ...(vehicle !== undefined && { vehicle }),
    },
  });

  return NextResponse.json({
    goal: {
      ...goal,
      current: Number(goal.current),
      target: Number(goal.target),
    },
  });
}

export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;
  const { id } = await ctx.params;

  const existing = await prisma.capitalGoal.findFirst({
    where: { id, userId: auth.session.userId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Goal not found" }, { status: 404 });
  }

  await prisma.capitalGoal.update({
    where: { id },
    data: { archivedAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
