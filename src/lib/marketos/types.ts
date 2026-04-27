/**
 * MarketOS — domain types.
 *
 * These types are the **DTO contract** between the data layer
 * (`src/lib/marketos/queries/*`) and the UI components under
 * `src/components/prototypes/market-os/`. They mirror the SQL schema in
 * `.windsurf/contexts/marketos-data-flow.md` §3, but with two display
 * adaptations:
 *
 * 1. Money is exposed as integer **dollars** (number) to keep the UI
 *    formatters identical to the prototype era. The DB stores cents
 *    (`bigint`); the conversion happens in the query layer.
 * 2. Enums are TypeScript const objects so they can be imported into
 *    Server Components and Client Components alike. The string values
 *    match the SQL `check` constraints exactly.
 *
 * Do not import anything from `src/lib/prototypes/market-os/*` here —
 * that module is being deleted at the end of Phase 2 (T-210).
 */

// ---------- Enums ---------------------------------------------------------

export const MissionStatus = {
  Open: 'open',
  Active: 'active',
  Delivered: 'delivered',
  Completed: 'completed',
  Cancelled: 'cancelled',
} as const;
export type MissionStatus = (typeof MissionStatus)[keyof typeof MissionStatus];

export const Category = {
  Design: 'Design',
  Engineering: 'Engineering',
  Research: 'Research',
  Marketing: 'Marketing',
  HR: 'HR',
  Operations: 'Operations',
} as const;
export type Category = (typeof Category)[keyof typeof Category];

export const BidStatus = {
  Pending: 'pending',
  Shortlisted: 'shortlisted',
  Accepted: 'accepted',
  Declined: 'declined',
  Withdrawn: 'withdrawn',
} as const;
export type BidStatus = (typeof BidStatus)[keyof typeof BidStatus];

export const Tier = {
  Bronze: 'bronze',
  Silver: 'silver',
  Gold: 'gold',
  Platinum: 'platinum',
  Diamond: 'diamond',
} as const;
export type Tier = (typeof Tier)[keyof typeof Tier];

export const MemberRole = {
  Owner: 'owner',
  Admin: 'admin',
  Member: 'member',
} as const;
export type MemberRole = (typeof MemberRole)[keyof typeof MemberRole];

export const NotificationType = {
  BidReceived: 'bid_received',
  BidShortlisted: 'bid_shortlisted',
  BidAccepted: 'bid_accepted',
  BidDeclined: 'bid_declined',
  MissionPosted: 'mission_posted',
  MissionDelivered: 'mission_delivered',
  MissionCompleted: 'mission_completed',
  MissionCancelled: 'mission_cancelled',
  ReputationUp: 'reputation_up',
  PoolPeriodClosed: 'pool_period_closed',
  PayoutReleased: 'payout_released',
} as const;
export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export const OrgPeriod = {
  Month: 'month',
  Quarter: 'quarter',
  Half: 'half',
} as const;
export type OrgPeriod = (typeof OrgPeriod)[keyof typeof OrgPeriod];

export const OrgAccent = {
  Orange: 'orange',
  Blue: 'blue',
  Green: 'green',
} as const;
export type OrgAccent = (typeof OrgAccent)[keyof typeof OrgAccent];

// ---------- DTOs ----------------------------------------------------------

export interface OrgDTO {
  id: string;
  slug: string;
  name: string;
  currency: string; // 'USD' for MVP
  memberCount: number;
}

export interface OrgSettingsDTO {
  orgId: string;
  ratio: number; // payroll_ratio_pct
  baseSplit: number; // base_split_pct
  period: OrgPeriod;
  accent: OrgAccent;
  dark: boolean;
  updatedAt: string; // ISO
}

export interface MemberDTO {
  id: string;
  orgId: string;
  userId: string | null;
  displayName: string;
  role: MemberRole;
  title: string | null;
  bio: string | null;
  skills: string[];
  baseCompUsd: number;
  joinedAt: string; // ISO
}

/** Member with the computed stats from `marketos_member_stats`. */
export interface MemberWithStatsDTO extends MemberDTO {
  reputation: number;
  tier: Tier;
  completed: number;
  onTimePct: number | null; // null when the member has no completed missions
  avgRating: number | null;
  reviewCount: number;
  totalEarnedUsd: number;
  specialty: Category | null;
}

export interface MissionDTO {
  id: string;
  orgId: string;
  title: string;
  slug: string;
  category: Category;
  budgetUsd: number;
  deadline: string; // ISO date
  status: MissionStatus;
  description: string;
  deliverables: string[];
  bidCount: number;
  posterId: string;
  posterName: string;
  postedAt: string; // ISO
  acceptedBidId: string | null;
  deliveredAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
}

export interface BidDTO {
  id: string;
  missionId: string;
  bidderId: string;
  bidderName: string;
  bidderReputation: number;
  amountUsd: number;
  status: BidStatus;
  proposal: string;
  submittedAt: string; // ISO
  decidedAt: string | null;
}

export interface PoolCompositionDTO {
  periodLabel: string;
  ratio: number;
  baseSplit: number;
  totalUsd: number;
  baseUsd: number;
  missionsLockedUsd: number;
  unallocatedUsd: number;
  revenueUsd: number;
  isCurrent: boolean;
}

export interface PoolHistoryEntryDTO {
  periodLabel: string;
  totalUsd: number;
  isCurrent: boolean;
}

export interface UpcomingPayoutDTO {
  payoutId: string;
  scheduledFor: string; // ISO date
  amountUsd: number;
  missionTitle: string;
  recipientName: string;
}

export interface NotificationDTO {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  link: string | null;
  read: boolean;
  createdAt: string; // ISO
}

export interface MissionHistoryEntryDTO {
  missionId: string;
  title: string;
  category: Category;
  earnedUsd: number;
  rating: number | null;
  completedAt: string; // ISO
}
