import 'server-only';
import { prisma } from '@/lib/db/prisma';
import { cookies } from 'next/headers';
import { createClient as createSupabaseServerClient } from '@/utils/supabase/server';
import {
  MemberRole,
  type MemberDTO,
} from '@/lib/marketos/types';
import type { User } from '@supabase/supabase-js';
import type { MarketosMember } from '@prisma/client';

/**
 * MarketOS — auth & member resolution helpers.
 *
 * Spec: `.windsurf/contexts/marketos-data-flow.md` §7.
 *
 * - Anonymous reads: pages call queries directly with the demo org slug.
 *   They never invoke these helpers.
 * - Authenticated reads: server components call `getCurrentMember(orgSlug)`,
 *   which returns `null` for anonymous or non-member users. UI degrades
 *   gracefully (e.g. dashboard hides the "My Bid Rate" stat).
 * - Mutations: server actions call `requireMember(orgSlug, role?)`. It
 *   throws `MarketosAuthError` on null, which the action wraps into the
 *   `{ ok: false, error }` discriminated union.
 *
 * Auth never happens at the Prisma connection level (RLS is bypassed by
 * the service-role-equivalent connection). Authorization is enforced by
 * these helpers + `requireMember` at the top of every server action.
 */

// ---------- Errors --------------------------------------------------------

export class MarketosAuthError extends Error {
  readonly code: 'UNAUTHENTICATED' | 'NOT_A_MEMBER' | 'INSUFFICIENT_ROLE';
  constructor(
    code: 'UNAUTHENTICATED' | 'NOT_A_MEMBER' | 'INSUFFICIENT_ROLE',
    message: string,
  ) {
    super(message);
    this.code = code;
    this.name = 'MarketosAuthError';
  }
}

// ---------- Helpers -------------------------------------------------------

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient(cookieStore);
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;
  return data.user;
}

/**
 * Resolve the active member for the given org slug, or `null` if the
 * caller is anonymous or not a member of that org.
 *
 * This is the read-side helper used by every Server Component that
 * needs to know "who is asking?". It is intentionally null-safe so
 * public demo pages can render with the same code path as authenticated
 * ones.
 */
export async function getCurrentMember(
  orgSlug: string,
): Promise<MemberDTO | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const member = await prisma.marketosMember.findFirst({
    where: {
      userId: user.id,
      removedAt: null,
      org: { slug: orgSlug },
    },
  });
  if (!member) return null;
  return toMemberDTO(member);
}

/**
 * Require an authenticated member of the given org. Throws
 * `MarketosAuthError` if the caller is anonymous, not a member, or
 * (when `role` is given) lacks the required role tier.
 *
 * Role hierarchy: owner > admin > member. Passing `role: 'admin'`
 * accepts both `admin` and `owner`.
 */
export async function requireMember(
  orgSlug: string,
  role?: MemberRole,
): Promise<MemberDTO> {
  const user = await getCurrentUser();
  if (!user) {
    throw new MarketosAuthError(
      'UNAUTHENTICATED',
      'You must be signed in to perform this action.',
    );
  }
  const member = await getCurrentMember(orgSlug);
  if (!member) {
    throw new MarketosAuthError(
      'NOT_A_MEMBER',
      `You are not a member of "${orgSlug}".`,
    );
  }
  if (role && !memberHasRole(member.role, role)) {
    throw new MarketosAuthError(
      'INSUFFICIENT_ROLE',
      `This action requires the "${role}" role or higher.`,
    );
  }
  return member;
}

/**
 * Returns true if `actual` is at least as privileged as `required`.
 * owner ≥ admin ≥ member.
 */
export function memberHasRole(
  actual: MemberRole,
  required: MemberRole,
): boolean {
  const rank: Record<MemberRole, number> = {
    [MemberRole.Member]: 1,
    [MemberRole.Admin]: 2,
    [MemberRole.Owner]: 3,
  };
  return rank[actual] >= rank[required];
}

// ---------- Mappers -------------------------------------------------------

export function toMemberDTO(row: MarketosMember): MemberDTO {
  return {
    id: row.id,
    orgId: row.orgId,
    userId: row.userId,
    displayName: row.displayName,
    role: row.role as MemberRole,
    title: row.title,
    bio: row.bio,
    skills: row.skills,
    baseCompUsd: Math.floor(Number(row.baseCompCents) / 100),
    joinedAt: row.joinedAt.toISOString(),
  };
}
