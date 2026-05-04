/**
 * CapitalOS — Goals API
 * GET  /api/capital-os/goals  → list user's goals
 * POST /api/capital-os/goals  → create a new goal
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireCapitalOSAuth, isAuthed } from "@/lib/capital-os/auth";
import { CapitalGoalPriority } from "@prisma/client";
import { CapitalGoalCategory } from "@/lib/capital-os/types";

export async function GET() {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;

  const goals = await prisma.capitalGoal.findMany({
    where: { userId: auth.session.userId, archivedAt: null },
    orderBy: [{ priority: "asc" }, { name: "asc" }],
  });

  return NextResponse.json({
    success: true,
    data: {
      goals: goals.map((g) => ({
        ...g,
        current: Number(g.current),
        target: Number(g.target),
        monthlyAllocation: (g as any).monthlyAllocation != null ? Number((g as any).monthlyAllocation) : null,
      })),
    },
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;

  const body = await req.json();
  const { name, current, target, deadline, priority, vehicle, category, description, monthlyAllocation, linkedAccountId } = body;

  if (!name || !target || !priority) {
    return NextResponse.json(
      { success: false, error: "name, target, and priority are required" },
      { status: 400 },
    );
  }

  if (!Object.values(CapitalGoalPriority).includes(priority)) {
    return NextResponse.json(
      { success: false, error: `Invalid priority: ${priority}` },
      { status: 400 },
    );
  }

  if (category && !Object.values(CapitalGoalCategory).includes(category)) {
    return NextResponse.json(
      { success: false, error: `Invalid category: ${category}` },
      { status: 400 },
    );
  }

  const currentVal = BigInt(current ?? 0);
  const targetVal = BigInt(target);

  const goal = await (prisma.capitalGoal.create as any)({
    data: {
      userId: auth.session.userId,
      name,
      current: currentVal,
      target: targetVal,
      deadline: deadline ? new Date(deadline) : null,
      priority: priority as CapitalGoalPriority,
      vehicle: vehicle ?? null,
      category: (category as CapitalGoalCategory) ?? null,
      description: description ?? null,
      monthlyAllocation: monthlyAllocation != null ? BigInt(monthlyAllocation) : null,
      linkedAccountId: linkedAccountId ?? null,
      completedAt: currentVal >= targetVal ? new Date() : null,
    },
  });

  return NextResponse.json(
    {
      success: true,
      data: {
        ...goal,
        current: Number(goal.current),
        target: Number(goal.target),
        monthlyAllocation: (goal as any).monthlyAllocation != null ? Number((goal as any).monthlyAllocation) : null,
      },
    },
    { status: 201 },
  );
}
