import { prisma } from "@/lib/db/prisma";
import { getAccounts, milliunitsToSatangs } from "@/lib/capital-os/ynab";
import { CapitalAssetType, CapitalAccountSource } from "@prisma/client";
import {
  isAirtableConfigured,
  getAirtableAccounts,
  getAirtableLiabilities,
  getAirtableGoals,
} from "@/lib/capital-os/airtable";

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

export async function executeYnabSync(userId: string) {
  const ynabAccounts = await getAccounts();
  let synced = 0;
  let syncedLiabilities = 0;

  for (const ya of ynabAccounts) {
    const satangs = milliunitsToSatangs(ya.balance);

    if (isLiabilityType(ya.type)) {
      // Upsert as liability
      await prisma.capitalLiability.upsert({
        where: {
          id:
            (
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
          archivedAt: ya.deleted || ya.closed ? new Date() : null,
        },
        update: {
          name: ya.name,
          balance: BigInt(satangs),
          archivedAt: ya.deleted || ya.closed ? new Date() : null,
        },
      });
      synced++;
    }
  }

  // Record a Snapshot of the state after sync
  const [dbAccs, dbLiabs] = await Promise.all([
    prisma.capitalAccount.findMany({
      where: { userId, archivedAt: null },
    }),
    prisma.capitalLiability.findMany({
      where: { userId, archivedAt: null },
    }),
  ]);

  const liquid = dbAccs
    .filter((a) => a.type === "LIQUID" || a.type === "SEMI_LIQUID")
    .reduce((sum, a) => sum + a.balance, BigInt(0));

  const invested = dbAccs
    .filter((a) => a.type === "INVESTMENT" || a.type === "FIXED")
    .reduce((sum, a) => sum + a.balance, BigInt(0));

  const liab = dbLiabs.reduce((sum, l) => sum + l.balance, BigInt(0));
  const netWorth = liquid + invested + liab;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.capitalSnapshot.upsert({
    where: {
      userId_date: { userId, date: today },
    },
    create: {
      userId,
      date: today,
      netWorth,
      liquid,
      invested,
      liabilities: liab,
    },
    update: {
      netWorth,
      liquid,
      invested,
      liabilities: liab,
    },
  });

  // ── Accountant Agent: Divergence Detection ─────────────────────
  // Get previous snapshot for delta calculation
  const previousSnapshot = await prisma.capitalSnapshot.findFirst({
    where: { userId, date: { lt: today } },
    orderBy: { date: "desc" },
  });

  if (previousSnapshot) {
    const prevNetWorth = Number(previousSnapshot.netWorth);
    const currNetWorth = Number(netWorth);
    const delta = currNetWorth - prevNetWorth;
    const deltaPercent = prevNetWorth !== 0 ? Math.abs(delta / prevNetWorth) : 0;

    // Flag divergences > 5%
    if (deltaPercent > 0.05) {
      const toTHB = (satangs: bigint) =>
        (Number(satangs) / 100).toLocaleString("en-US", {
          style: "currency",
          currency: "THB",
          maximumFractionDigits: 0,
        });

      await prisma.capitalAlert.create({
        data: {
          userId,
          type: "DIVERGENCE",
          severity: deltaPercent > 0.15 ? "HIGH" : "MEDIUM",
          title: `Net Worth ${delta > 0 ? "Jump" : "Drop"} Detected`,
          message: `Net worth changed ${delta > 0 ? "+" : ""}${toTHB(BigInt(Math.abs(delta)))} (${(deltaPercent * 100).toFixed(1)}%) since ${previousSnapshot.date.toISOString().slice(0, 10)}. Current: ${toTHB(netWorth)}. Please verify this is expected.`,
        },
      });
    }
  }

  // Record sync log
  await prisma.capitalSyncLog.create({
    data: {
      userId,
      source: "YNAB",
      action: "SYNC",
      entityType: "SNAPSHOT",
      entityId: null,
      before: previousSnapshot ? { netWorth: previousSnapshot.netWorth.toString() } : {},
      after: { netWorth: netWorth.toString(), accounts: synced, liabilities: syncedLiabilities },
    },
  });

  return { synced, syncedLiabilities };
}

export async function executeAirtableSync(userId: string) {
  if (!isAirtableConfigured()) {
    throw new Error("Airtable is not configured.");
  }

  const [accounts, liabilities, goals] = await Promise.all([
    getAirtableAccounts(),
    getAirtableLiabilities(),
    getAirtableGoals(),
  ]);

  let syncedAccounts = 0;
  let syncedLiabilities = 0;
  let syncedGoals = 0;

  // Sync Accounts
  for (const acc of accounts) {
    const satangs = BigInt(Math.round(acc.balance * 100));

    await prisma.capitalAccount.upsert({
      where: {
        userId_externalId: { userId, externalId: acc.id },
      },
      create: {
        userId,
        name: acc.name,
        balance: satangs,
        type: acc.type,
        source: CapitalAccountSource.AIRTABLE,
        externalId: acc.id,
        icon: acc.icon ?? "📊",
      },
      update: {
        name: acc.name,
        balance: satangs,
        type: acc.type,
        icon: acc.icon ?? "📊",
        archivedAt: acc.archived ? new Date() : null,
      },
    });
    syncedAccounts++;
  }

  // Sync Liabilities
  for (const liab of liabilities) {
    const satangs = BigInt(Math.round(liab.balance * 100));

    const existing = await prisma.capitalLiability.findFirst({
      where: { userId, name: liab.name },
      select: { id: true },
    });

    if (existing) {
      await prisma.capitalLiability.update({
        where: { id: existing.id },
        data: {
          balance: satangs,
          apr: liab.apr,
          icon: liab.icon ?? "💳",
          archivedAt: liab.archived ? new Date() : null,
        },
      });
    } else {
      await prisma.capitalLiability.create({
        data: {
          userId,
          name: liab.name,
          balance: satangs,
          apr: liab.apr,
          icon: liab.icon ?? "💳",
        },
      });
    }
    syncedLiabilities++;
  }

  // Sync Goals
  for (const goal of goals) {
    const currentSatangs = BigInt(Math.round(goal.current * 100));
    const targetSatangs = BigInt(Math.round(goal.target * 100));

    const existing = await prisma.capitalGoal.findFirst({
      where: { userId, name: goal.name },
      select: { id: true },
    });

    if (existing) {
      await prisma.capitalGoal.update({
        where: { id: existing.id },
        data: {
          current: currentSatangs,
          target: targetSatangs,
          priority: goal.priority,
          deadline: goal.deadline ? new Date(goal.deadline) : null,
          vehicle: goal.vehicle,
          archivedAt: goal.archived ? new Date() : null,
        },
      });
    } else {
      await prisma.capitalGoal.create({
        data: {
          userId,
          name: goal.name,
          current: currentSatangs,
          target: targetSatangs,
          priority: goal.priority,
          deadline: goal.deadline ? new Date(goal.deadline) : null,
          vehicle: goal.vehicle,
        },
      });
    }
    syncedGoals++;
  }

  // ── Accountant Agent: Divergence Detection for Airtable ─────────
  const [dbAccs, dbLiabs] = await Promise.all([
    prisma.capitalAccount.findMany({
      where: { userId, archivedAt: null },
    }),
    prisma.capitalLiability.findMany({
      where: { userId, archivedAt: null },
    }),
  ]);

  const liab = dbLiabs.reduce((sum, l) => sum + l.balance, BigInt(0));
  const netWorth = dbAccs.reduce((sum, a) => sum + a.balance, BigInt(0)) + liab;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get previous snapshot for delta calculation
  const previousSnapshot = await prisma.capitalSnapshot.findFirst({
    where: { userId, date: { lt: today } },
    orderBy: { date: "desc" },
  });

  if (previousSnapshot) {
    const prevNetWorth = Number(previousSnapshot.netWorth);
    const currNetWorth = Number(netWorth);
    const delta = currNetWorth - prevNetWorth;
    const deltaPercent = prevNetWorth !== 0 ? Math.abs(delta / prevNetWorth) : 0;

    // Flag divergences > 5%
    if (deltaPercent > 0.05) {
      const toTHB = (satangs: bigint) =>
        (Number(satangs) / 100).toLocaleString("en-US", {
          style: "currency",
          currency: "THB",
          maximumFractionDigits: 0,
        });

      await prisma.capitalAlert.create({
        data: {
          userId,
          type: "DIVERGENCE",
          severity: deltaPercent > 0.15 ? "HIGH" : "MEDIUM",
          title: `Airtable Sync: Net Worth ${delta > 0 ? "Jump" : "Drop"}`,
          message: `Airtable sync caused net worth change of ${delta > 0 ? "+" : ""}${toTHB(BigInt(Math.abs(delta)))} (${(deltaPercent * 100).toFixed(1)}%). Previous: ${toTHB(previousSnapshot.netWorth)}, Current: ${toTHB(netWorth)}.`,
        },
      });
    }
  }

  // Record sync log
  await prisma.capitalSyncLog.create({
    data: {
      userId,
      source: "AIRTABLE",
      action: "SYNC",
      entityType: "SNAPSHOT",
      entityId: null,
      before: previousSnapshot ? { netWorth: previousSnapshot.netWorth.toString() } : {},
      after: { netWorth: netWorth.toString(), accounts: syncedAccounts, liabilities: syncedLiabilities, goals: syncedGoals },
    },
  });

  return { syncedAccounts, syncedLiabilities, syncedGoals };
}
