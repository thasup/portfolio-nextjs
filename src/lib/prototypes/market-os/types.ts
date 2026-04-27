/**
 * MarketOS prototype — domain types.
 *
 * Mock-only model. There is no persistence layer; these shapes describe
 * the seed data in `data.ts` and the local component state.
 */

export const MissionStatus = {
  Open: 'open',
  Active: 'active',
  Completed: 'completed',
  Draft: 'draft',
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
  Bronze: 'Bronze',
  Silver: 'Silver',
  Gold: 'Gold',
  Platinum: 'Platinum',
} as const;
export type Tier = (typeof Tier)[keyof typeof Tier];

export const NotificationType = {
  BidReceived: 'bid_received',
  BidAccepted: 'bid_accepted',
  BidDeclined: 'bid_declined',
  BidShortlisted: 'bid_shortlisted',
  MissionPosted: 'mission_posted',
  MissionCompleted: 'mission_completed',
  ReputationUp: 'reputation_up',
  PoolUpdate: 'pool_update',
} as const;
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

export interface Mission {
  id: string;
  title: string;
  cat: Category;
  budget: number;
  deadline: string; // ISO date
  status: MissionStatus;
  bids: number;
  posted: string; // human relative ('3 days ago')
  desc: string;
  deliverables: string[];
  poster: string;
  posterId: string;
}

export interface Bid {
  id: string;
  missionId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  status: BidStatus;
  daysAgo: number;
  proposal: string;
  reputation: number;
}

export interface Person {
  id: string;
  name: string;
  role: string;
  reputation: number;
  tier: Tier;
  completed: number;
  onTime: number; // 0-100
  rating: number; // 0-5
  totalEarned: number;
  skills: string[];
  specialty: Category;
}

export interface Pool {
  period: string;
  ratio: number; // % of revenue → pool
  total: number;
  missions: number;
  base: number;
  unallocated: number;
  history: { period: string; total: number }[];
  payouts: {
    person: string;
    mission: string;
    amount: number;
    releaseDate: string;
  }[];
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  ts: string; // ISO
  read: boolean;
  link?: string;
}

export interface OrgSettings {
  name: string;
  memberCount: number;
  ratio: number; // % of revenue
  baseSplit: number; // % of pool to base comp
  period: 'month' | 'quarter' | 'half';
  accent: 'orange' | 'blue' | 'green';
  dark: boolean;
}
