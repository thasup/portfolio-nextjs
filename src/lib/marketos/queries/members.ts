import "server-only";
import { prisma } from "@/lib/db/prisma";
import { centsToDollars } from "@/lib/marketos/calc";
import { toMemberDTO } from "@/lib/marketos/auth";
import {
  type MemberWithStatsDTO,
  type MissionHistoryEntryDTO,
  type Category,
  type Tier,
} from "@/lib/marketos/types";

/**
 * MarketOS — member reads with computed stats from `marketos_member_stats`.
 *
 * Spec: `.windsurf/contexts/marketos-data-flow.md` §6.6, §6.7, §6.8, §6.9, §8.7, §8.8.
 *
 * The stats view is not modelled in Prisma (it's a SQL view, not a
 * table). All access goes through `$queryRaw` with carefully-typed
 * row shapes that mirror the view's columns.
 */

interface StatsRow {
  member_id: string;
  org_id: string;
  user_id: string | null;
  display_name: string;
  role: string;
  title: string | null;
  bio: string | null;
  skills: string[];
  base_comp_cents: bigint;
  joined_at: Date;
  reputation: number;
  tier: string;
  completed: number;
  on_time_pct: number | null;
  avg_rating: string | null; // numeric(4,2) deserialises as string
  review_count: number;
  total_earned_cents: bigint;
  specialty: string | null;
}

function rowToMemberWithStats(r: StatsRow): MemberWithStatsDTO {
  return {
    id: r.member_id,
    orgId: r.org_id,
    userId: r.user_id,
    displayName: r.display_name,
    role: r.role as MemberWithStatsDTO["role"],
    title: r.title,
    bio: r.bio,
    skills: r.skills,
    baseCompUsd: centsToDollars(r.base_comp_cents),
    joinedAt: r.joined_at.toISOString(),
    reputation: Number(r.reputation),
    tier: r.tier as Tier,
    completed: Number(r.completed),
    onTimePct: r.on_time_pct == null ? null : Number(r.on_time_pct),
    avgRating: r.avg_rating == null ? null : Number(r.avg_rating),
    reviewCount: Number(r.review_count),
    totalEarnedUsd: centsToDollars(r.total_earned_cents),
    specialty: (r.specialty as Category | null) ?? null,
  };
}

export async function getMemberWithStats(
  memberId: string,
): Promise<MemberWithStatsDTO | null> {
  const rows = await prisma.$queryRaw<StatsRow[]>`
    select
      mb.id            as member_id,
      mb.org_id        as org_id,
      mb.user_id       as user_id,
      mb.display_name  as display_name,
      mb.role          as role,
      mb.title         as title,
      mb.bio           as bio,
      mb.skills        as skills,
      mb.base_comp_cents as base_comp_cents,
      mb.joined_at     as joined_at,
      s.reputation,
      s.tier,
      s.completed,
      s.on_time_pct,
      s.avg_rating::text as avg_rating,
      s.review_count,
      s.total_earned_cents,
      s.specialty
    from marketos_members mb
    join marketos_member_stats s on s.member_id = mb.id
    where mb.id = ${memberId}::uuid
      and mb.removed_at is null
    limit 1
  `;
  if (rows.length === 0) return null;
  return rowToMemberWithStats(rows[0]);
}

export async function listLeaderboard(
  orgId: string,
  options: { limit?: number } = {},
): Promise<MemberWithStatsDTO[]> {
  const limit = options.limit ?? 50;
  const rows = await prisma.$queryRaw<StatsRow[]>`
    select
      mb.id            as member_id,
      mb.org_id        as org_id,
      mb.user_id       as user_id,
      mb.display_name  as display_name,
      mb.role          as role,
      mb.title         as title,
      mb.bio           as bio,
      mb.skills        as skills,
      mb.base_comp_cents as base_comp_cents,
      mb.joined_at     as joined_at,
      s.reputation,
      s.tier,
      s.completed,
      s.on_time_pct,
      s.avg_rating::text as avg_rating,
      s.review_count,
      s.total_earned_cents,
      s.specialty
    from marketos_members mb
    join marketos_member_stats s on s.member_id = mb.id
    where mb.org_id = ${orgId}::uuid
      and mb.removed_at is null
    order by s.reputation desc nulls last, mb.display_name asc
    limit ${limit}
  `;
  return rows.map(rowToMemberWithStats);
}

/**
 * Spec §6.8 — Mission history table on `/app/profile`. Sorted newest
 * first, limited to 20.
 */
export async function getMemberMissionHistory(
  memberId: string,
  options: { limit?: number } = {},
): Promise<MissionHistoryEntryDTO[]> {
  const limit = options.limit ?? 20;
  const rows = await prisma.marketosMission.findMany({
    where: {
      status: "completed",
      acceptedBid: { bidderId: memberId },
    },
    orderBy: { completedAt: "desc" },
    take: limit,
    select: {
      id: true,
      title: true,
      category: true,
      completedAt: true,
      acceptedBid: {
        select: {
          payout: { select: { amountCents: true } },
        },
      },
      reviews: {
        where: { direction: "poster_to_contributor" },
        select: { rating: true },
        take: 1,
      },
    },
  });
  return rows
    .filter((m) => m.completedAt !== null)
    .map((m) => ({
      missionId: m.id,
      title: m.title,
      category: m.category as Category,
      earnedUsd: centsToDollars(
        m.acceptedBid?.payout?.amountCents ?? BigInt(0),
      ),
      rating: m.reviews[0]?.rating ?? null,
      completedAt: m.completedAt!.toISOString(),
    }));
}

/**
 * Lightweight active-members listing (no stats). Useful for selectors
 * and "@mention" autocomplete. Currently unused but referenced by the
 * spec under "Settings page member count + future invite UI".
 */
export async function listActiveMembers(orgId: string) {
  const rows = await prisma.marketosMember.findMany({
    where: { orgId, removedAt: null },
    orderBy: { displayName: "asc" },
  });
  return rows.map(toMemberDTO);
}
