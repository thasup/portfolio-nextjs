import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireCapitalOSAuth, isAuthed } from "@/lib/capital-os/auth";

export async function GET(req: NextRequest) {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;

  const scenarios = await prisma.capitalScenario.findMany({
    where: { userId: auth.session.userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    scenarios: scenarios.map((s) => ({
      ...s,
      burnRate: Number(s.burnRate),
      postSuccessIncome: Number(s.postSuccessIncome),
      investReturn: Number(s.investReturn),
    })),
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;

  const body = await req.json();

  const scenario = await prisma.capitalScenario.create({
    data: {
      userId: auth.session.userId,
      name: body.name,
      burnRate: BigInt(body.burnRate),
      ssoMonths: body.ssoMonths,
      investReturn: body.investReturn,
      missionSuccessMonth: body.missionSuccessMonth,
      postSuccessIncome: BigInt(body.postSuccessIncome),
    },
  });

  return NextResponse.json({
    success: true,
    scenario: {
      ...scenario,
      burnRate: Number(scenario.burnRate),
      postSuccessIncome: Number(scenario.postSuccessIncome),
      investReturn: Number(scenario.investReturn),
    },
  });
}
