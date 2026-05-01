/**
 * CapitalOS — YNAB Sync API
 * POST /api/capital-os/sync/ynab  → fetch YNAB accounts → upsert into DB
 *
 * This is the core data pipeline:
 * 1. Fetch accounts from YNAB API
 * 2. Upsert each account into capital_accounts (matched by externalId)
 * 3. Record a snapshot of the current net worth
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireCapitalOSAuth, isAuthed } from "@/lib/capital-os/auth";
import { getAccounts, milliunitsToSatangs } from "@/lib/capital-os/ynab";
import { CapitalAssetType, CapitalAccountSource } from "@prisma/client";

/** Map YNAB account types to CapitalOS asset types. */
function mapYNABType(ynabType: string): CapitalAssetType {
  switch (ynabType) {
    case "checking":
    case "cash":
      return CapitalAssetType.LIQUID;
    case "savings":
      return CapitalAssetType.SEMI_LIQUID;
    case "investmentAccount":
    case "otherAsset":
      return CapitalAssetType.INVESTMENT;
    case "creditCard":
    case "lineOfCredit":
    case "mortgage":
    case "autoLoan":
    case "studentLoan":
    case "personalLoan":
    case "otherLiability":
      return CapitalAssetType.LIQUID; // debt tracked separately
    default:
      return CapitalAssetType.LIQUID;
  }
}

/** Check if a YNAB account type is a liability. */
function isLiabilityType(ynabType: string): boolean {
  return [
    "creditCard",
    "lineOfCredit",
    "mortgage",
    "autoLoan",
    "studentLoan",
    "personalLoan",
    "otherLiability",
  ].includes(ynabType);
}

export async function POST() {
  const auth = await requireCapitalOSAuth();
  if (!isAuthed(auth)) return auth;

  const userId = auth.session.userId;

  try {
    const ynabAccounts = await getAccounts();
    let synced = 0;
    let syncedLiabilities = 0;

    for (const ya of ynabAccounts) {
      const satangs = milliunitsToSatangs(ya.balance);

      if (isLiabilityType(ya.type)) {
        // Upsert as liability
        await prisma.capitalLiability.upsert({
          where: {
            id: (
              await prisma.capitalLiability.findFirst({
                where: { userId, name: ya.name },
                select: { id: true },
              })
            )?.id ?? "00000000-0000-0000-0000-000000000000",
          },
          create: {
            userId,
            name: ya.name,
            balance: BigInt(satangs),
            icon: "💳",
          },
          update: {
            balance: BigInt(satangs),
          },
        });
        syncedLiabilities++;
      } else {
        // Upsert as account
        await prisma.capitalAccount.upsert({
          where: {
            userId_externalId: { userId, externalId: ya.id },
          },
          create: {
            userId,
            name: ya.name,
            balance: BigInt(satangs),
            type: mapYNABType(ya.type),
            source: CapitalAccountSource.YNAB,
            externalId: ya.id,
            icon: "🏦",
          },
          update: {
            name: ya.name,
            balance: BigInt(satangs),
          },
        });
        synced++;
      }
    }

    // Record a snapshot
    const accounts = await prisma.capitalAccount.findMany({
      where: { userId, archivedAt: null },
    });
    const liabilities = await prisma.capitalLiability.findMany({
      where: { userId, archivedAt: null },
    });

    const totalAssets = accounts.reduce((s, a) => s + a.balance, BigInt(0));
    const totalLiquid = accounts
      .filter((a) => a.type === CapitalAssetType.LIQUID)
      .reduce((s, a) => s + a.balance, BigInt(0));
    const totalInvested = accounts
      .filter(
        (a) =>
          a.type === CapitalAssetType.INVESTMENT ||
          a.type === CapitalAssetType.SEMI_LIQUID,
      )
      .reduce((s, a) => s + a.balance, BigInt(0));
    const totalLiab = liabilities.reduce(
      (s, l) => s + (l.balance < BigInt(0) ? -l.balance : l.balance),
      BigInt(0),
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.capitalSnapshot.upsert({
      where: { userId_date: { userId, date: today } },
      create: {
        userId,
        date: today,
        netWorth: totalAssets - totalLiab,
        liquid: totalLiquid,
        invested: totalInvested,
        liabilities: totalLiab,
      },
      update: {
        netWorth: totalAssets - totalLiab,
        liquid: totalLiquid,
        invested: totalInvested,
        liabilities: totalLiab,
      },
    });

    return NextResponse.json({
      success: true,
      synced,
      syncedLiabilities,
      total: ynabAccounts.length,
    });
  } catch (error) {
    console.error("[CapitalOS] YNAB sync failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sync failed" },
      { status: 500 },
    );
  }
}
