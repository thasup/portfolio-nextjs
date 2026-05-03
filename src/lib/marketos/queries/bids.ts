import "server-only";
import { prisma } from "@/lib/db/prisma";
import { centsToDollars, computeBidRatePct } from "@/lib/marketos/calc";
import {
  type BidDTO,
  type BidStatus,
  BidStatus as BidStatusEnum,
} from "@/lib/marketos/types";
import type { Prisma } from "@prisma/client";

/**
 * MarketOS — bid reads.
 *
 * Spec: `.windsurf/contexts/marketos-data-flow.md` §3.7, §6.5, §8.4, §8.6.
 *
 * Bidder reputation is fetched from the `marketos_member_stats` SQL
 * view (which is not modelled in Prisma). The Prisma helper here uses
 * `$queryRaw` for that join so the formula stays single-sourced in SQL.
 */

const BID_INCLUDE = {
  bidder: { select: { id: true, displayName: true } },
} satisfies Prisma.MarketosBidInclude;

type BidRow = Prisma.MarketosBidGetPayload<{ include: typeof BID_INCLUDE }>;

function toBidDTO(row: BidRow, reputation: number): BidDTO {
  return {
    id: row.id,
    missionId: row.missionId,
    bidderId: row.bidder.id,
    bidderName: row.bidder.displayName,
    bidderReputation: reputation,
    amountUsd: centsToDollars(row.amountCents),
    status: row.status as BidStatus,
    proposal: row.proposal,
    submittedAt: row.submittedAt.toISOString(),
    decidedAt: row.decidedAt?.toISOString() ?? null,
  };
}

/**
 * Fetch reputation for a set of member IDs in one query against the
 * `marketos_member_stats` view. Returns a Map keyed by member id.
 */
async function getReputationMap(
  memberIds: string[],
): Promise<Map<string, number>> {
  if (memberIds.length === 0) return new Map();
  const rows = await prisma.$queryRaw<
    Array<{ member_id: string; reputation: number }>
  >`
    select member_id, reputation
    from marketos_member_stats
    where member_id = any(${memberIds}::uuid[])
  `;
  const map = new Map<string, number>();
  for (const r of rows) {
    map.set(r.member_id, Number(r.reputation));
  }
  return map;
}

export async function listBidsForMission(missionId: string): Promise<BidDTO[]> {
  const rows = await prisma.marketosBid.findMany({
    where: { missionId },
    orderBy: { submittedAt: "desc" },
    include: BID_INCLUDE,
  });
  const reps = await getReputationMap(rows.map((r) => r.bidder.id));
  return rows.map((r) => toBidDTO(r, reps.get(r.bidder.id) ?? 0));
}

export async function listMyBids(memberId: string): Promise<BidDTO[]> {
  const rows = await prisma.marketosBid.findMany({
    where: { bidderId: memberId },
    orderBy: { submittedAt: "desc" },
    include: BID_INCLUDE,
  });
  const reps = await getReputationMap([memberId]);
  return rows.map((r) => toBidDTO(r, reps.get(memberId) ?? 0));
}

/**
 * Spec §6.5 — bid acceptance rate over the last 90 days. Returns
 * `null` if the member has no decided bids in the window (renders as
 * "—" in the UI).
 */
export async function getBidRate(memberId: string): Promise<number | null> {
  const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const [accepted, totalDecided] = await Promise.all([
    prisma.marketosBid.count({
      where: {
        bidderId: memberId,
        status: BidStatusEnum.Accepted,
        submittedAt: { gte: since },
      },
    }),
    prisma.marketosBid.count({
      where: {
        bidderId: memberId,
        status: { in: [BidStatusEnum.Accepted, BidStatusEnum.Declined] },
        submittedAt: { gte: since },
      },
    }),
  ]);
  return computeBidRatePct(totalDecided, accepted);
}
