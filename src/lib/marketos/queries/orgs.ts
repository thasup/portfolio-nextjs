import 'server-only';
import { prisma } from '@/lib/db/prisma';
import {
  type OrgDTO,
  type OrgSettingsDTO,
  OrgAccent,
  OrgPeriod,
} from '@/lib/marketos/types';

/**
 * MarketOS — org-level reads.
 *
 * Spec: `.windsurf/contexts/marketos-data-flow.md` §3.1, §3.4, §8.11.
 *
 * No auth checks here — these are public reads served by Server
 * Components for both anonymous demo viewers and signed-in members.
 * Mutation paths use server actions (Phase 3) and check auth there.
 */

export async function getOrgBySlug(slug: string): Promise<OrgDTO | null> {
  const org = await prisma.marketosOrg.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      name: true,
      currency: true,
      _count: {
        select: { members: { where: { removedAt: null } } },
      },
    },
  });
  if (!org) return null;
  return {
    id: org.id,
    slug: org.slug,
    name: org.name,
    currency: org.currency,
    memberCount: org._count.members,
  };
}

export async function getOrgSettings(
  orgId: string,
): Promise<OrgSettingsDTO | null> {
  const settings = await prisma.marketosOrgSettings.findUnique({
    where: { orgId },
  });
  if (!settings) return null;
  return {
    orgId: settings.orgId,
    ratio: settings.payrollRatioPct,
    baseSplit: settings.baseSplitPct,
    period: settings.period as OrgPeriod,
    accent: settings.accent as OrgAccent,
    dark: settings.darkMode,
    updatedAt: settings.updatedAt.toISOString(),
  };
}

export async function getOrgMemberCount(orgId: string): Promise<number> {
  return prisma.marketosMember.count({
    where: { orgId, removedAt: null },
  });
}
