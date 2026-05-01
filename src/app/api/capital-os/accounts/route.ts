/**
 * CapitalOS — Accounts API
 * GET  /api/capital-os/accounts  → list user's accounts
 * POST /api/capital-os/accounts  → create a new account
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireCapitalOSAuth, isAuthed } from "@/lib/capital-os/auth";
import { CapitalAssetType, CapitalAccountSource } from "@prisma/client";

export async function GET() {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;

  const accounts = await prisma.capitalAccount.findMany({
    where: { userId: auth.session.userId, archivedAt: null },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });

  return NextResponse.json({
    accounts: accounts.map((a) => ({
      ...a,
      balance: Number(a.balance),
    })),
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;

  const body = await req.json();
  const { name, balance, type, source, externalId, icon, color } = body;

  if (!name || !type) {
    return NextResponse.json(
      { error: "name and type are required" },
      { status: 400 },
    );
  }

  if (!Object.values(CapitalAssetType).includes(type)) {
    return NextResponse.json(
      { error: `Invalid type: ${type}` },
      { status: 400 },
    );
  }

  const account = await prisma.capitalAccount.create({
    data: {
      userId: auth.session.userId,
      name,
      balance: BigInt(balance ?? 0),
      type: type as CapitalAssetType,
      source: (source as CapitalAccountSource) ?? CapitalAccountSource.MANUAL,
      externalId: externalId ?? null,
      icon: icon ?? null,
      color: color ?? null,
    },
  });

  return NextResponse.json(
    { account: { ...account, balance: Number(account.balance) } },
    { status: 201 },
  );
}
