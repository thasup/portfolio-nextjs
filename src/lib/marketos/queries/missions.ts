import "server-only";
import { prisma } from "@/lib/db/prisma";
import { centsToDollars } from "@/lib/marketos/calc";
import {
  type MissionDTO,
  type Category,
  type MissionStatus,
} from "@/lib/marketos/types";
import type { Prisma } from "@prisma/client";

/**
 * MarketOS — mission reads.
 *
 * Spec: `.windsurf/contexts/marketos-data-flow.md` §3.6, §6.1, §6.11, §8.3, §8.4.
 */

const MISSION_INCLUDE = {
  poster: { select: { id: true, displayName: true } },
  _count: { select: { bids: true } },
} satisfies Prisma.MarketosMissionInclude;

type MissionRow = Prisma.MarketosMissionGetPayload<{
  include: typeof MISSION_INCLUDE;
}>;

function toMissionDTO(row: MissionRow): MissionDTO {
  return {
    id: row.id,
    orgId: row.orgId,
    title: row.title,
    slug: row.slug,
    category: row.category as Category,
    budgetUsd: centsToDollars(row.budgetCents),
    deadline: row.deadline.toISOString(),
    status: row.status as MissionStatus,
    description: row.description,
    deliverables: Array.isArray(row.deliverables)
      ? (row.deliverables as string[])
      : [],
    bidCount: row._count.bids,
    posterId: row.poster.id,
    posterName: row.poster.displayName,
    postedAt: row.createdAt.toISOString(),
    acceptedBidId: row.acceptedBidId,
    deliveredAt: row.deliveredAt?.toISOString() ?? null,
    completedAt: row.completedAt?.toISOString() ?? null,
    cancelledAt: row.cancelledAt?.toISOString() ?? null,
  };
}

export interface ListMissionsOptions {
  status?: MissionStatus;
  category?: Category;
  /** Case-insensitive substring match on `title`. */
  search?: string;
  limit?: number;
  /** ISO timestamp; returns missions strictly older than this (createdAt). */
  cursor?: string;
}

export async function listMissions(
  orgId: string,
  options: ListMissionsOptions = {},
): Promise<MissionDTO[]> {
  const { status, category, search, limit = 50, cursor } = options;

  const where: Prisma.MarketosMissionWhereInput = {
    orgId,
    archivedAt: null,
    ...(status ? { status } : {}),
    ...(category ? { category } : {}),
    ...(search ? { title: { contains: search, mode: "insensitive" } } : {}),
    ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}),
  };

  const rows = await prisma.marketosMission.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: MISSION_INCLUDE,
  });
  return rows.map(toMissionDTO);
}

/**
 * Look up by canonical UUID *or* per-org slug. The prototype currently
 * routes via `m-001`-style slugs; production routes use UUIDs. Both
 * resolve here so we don't have to fork the page component.
 */
export async function getMissionBySlugOrId(
  orgId: string,
  slugOrId: string,
): Promise<MissionDTO | null> {
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      slugOrId,
    );
  const row = await prisma.marketosMission.findFirst({
    where: {
      orgId,
      archivedAt: null,
      ...(isUuid ? { id: slugOrId } : { slug: slugOrId }),
    },
    include: MISSION_INCLUDE,
  });
  if (!row) return null;
  return toMissionDTO(row);
}

/**
 * Spec §6.11 — counts grouped by status. Powers the
 * "{N} open · {M} in progress" line on `/app/missions`.
 */
export async function countMissionsByStatus(
  orgId: string,
): Promise<Record<MissionStatus, number>> {
  const rows = await prisma.marketosMission.groupBy({
    by: ["status"],
    where: { orgId, archivedAt: null },
    _count: { _all: true },
  });
  const result: Record<MissionStatus, number> = {
    open: 0,
    active: 0,
    delivered: 0,
    completed: 0,
    cancelled: 0,
  };
  for (const r of rows) {
    const key = r.status as MissionStatus;
    result[key] = r._count._all;
  }
  return result;
}

/**
 * Spec §6.1 — Active Missions stat for the dashboard.
 * Counts open + active + delivered (i.e. anything not yet terminal).
 */
export async function countActiveMissions(orgId: string): Promise<number> {
  return prisma.marketosMission.count({
    where: {
      orgId,
      archivedAt: null,
      status: { in: ["open", "active", "delivered"] },
    },
  });
}

/**
 * Spec §6.1 sub-line — distinct categories among non-terminal missions.
 */
export async function countActiveMissionCategories(
  orgId: string,
): Promise<number> {
  const rows = await prisma.marketosMission.findMany({
    where: {
      orgId,
      archivedAt: null,
      status: { in: ["open", "active", "delivered"] },
    },
    distinct: ["category"],
    select: { category: true },
  });
  return rows.length;
}
