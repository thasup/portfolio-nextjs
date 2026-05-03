/**
 * CapitalOS — Goals API
 * GET  /api/capital-os/goals  → list user's goals
 * POST /api/capital-os/goals  → create a new goal
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireCapitalOSAuth, isAuthed } from "@/lib/capital-os/auth";
import { CapitalGoalPriority } from "@prisma/client";

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
      })),
    },
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;

  const body = await req.json();
  const { name, current, target, deadline, priority, vehicle } = body;

  if (!name || !target || !priority) {
    return NextResponse.json(
      { error: "name, target, and priority are required" },
      { status: 400 },
    );
  }

  if (!Object.values(CapitalGoalPriority).includes(priority)) {
    return NextResponse.json(
      { error: `Invalid priority: ${priority}` },
      { status: 400 },
    );
  }

  const goal = await prisma.capitalGoal.create({
    data: {
      userId: auth.session.userId,
      name,
      current: BigInt(current ?? 0),
      target: BigInt(target),
      deadline: deadline ? new Date(deadline) : null,
      priority: priority as CapitalGoalPriority,
      vehicle: vehicle ?? null,
    },
  });

  return NextResponse.json(
    {
      success: true,
      data: {
        ...goal,
        current: Number(goal.current),
        target: Number(goal.target),
      },
    },
    { status: 201 },
  );
}
