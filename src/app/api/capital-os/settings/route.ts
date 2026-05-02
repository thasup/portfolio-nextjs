/**
 * CapitalOS — Settings API
 * GET   /api/capital-os/settings  → get user's settings
 * PATCH /api/capital-os/settings  → update user's settings
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireCapitalOSAuth, isAuthed } from "@/lib/capital-os/auth";

export async function GET() {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;

  let settings = await prisma.capitalSettings.findUnique({
    where: { userId: auth.session.userId },
  });

  // If no settings exist, create default ones
  if (!settings) {
    settings = await prisma.capitalSettings.create({
      data: {
        userId: auth.session.userId,
        runwayBurnRate: BigInt(2500000), // 25,000 THB default
        runwayAccountIds: [],
      },
    });
  }

  return NextResponse.json({
    settings: {
      ...settings,
      runwayBurnRate: Number(settings.runwayBurnRate),
    },
  });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;

  const body = await req.json();
  const { runwayBurnRate, runwayAccountIds } = body;

  const updateData: any = {};
  if (runwayBurnRate !== undefined)
    updateData.runwayBurnRate = BigInt(runwayBurnRate);
  if (runwayAccountIds !== undefined)
    updateData.runwayAccountIds = runwayAccountIds;

  const settings = await prisma.capitalSettings.upsert({
    where: { userId: auth.session.userId },
    update: updateData,
    create: {
      userId: auth.session.userId,
      runwayBurnRate: BigInt(runwayBurnRate ?? 2500000),
      runwayAccountIds: runwayAccountIds ?? [],
    },
  });

  return NextResponse.json({
    settings: {
      ...settings,
      runwayBurnRate: Number(settings.runwayBurnRate),
    },
  });
}
