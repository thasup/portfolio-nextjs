/**
 * Convenience aliases over the generated `Database` type.
 *
 * Prefer these over deep index chains:
 *
 *     import { LearnerRow, TopicInsert } from '@/lib/praxis/supabase/tables';
 *
 * rather than
 *
 *     import type { Database } from '@/lib/praxis/supabase/database.types';
 *     type LearnerRow = Database['public']['Tables']['nexus_users']['Row'];
 */
import type { Database } from '@/lib/praxis/supabase/database.types';

type T = Database['public']['Tables'];

export type UserRow = T['nexus_users']['Row'];
export type UserInsert = T['nexus_users']['Insert'];
export type UserUpdate = T['nexus_users']['Update'];

export type InvitationRow = T['praxis_invitations']['Row'];
export type InvitationInsert = T['praxis_invitations']['Insert'];
export type InvitationUpdate = T['praxis_invitations']['Update'];

export type TopicRow = T['praxis_topics']['Row'];
export type TopicInsert = T['praxis_topics']['Insert'];
export type TopicUpdate = T['praxis_topics']['Update'];

export type UnitRow = T['praxis_units']['Row'];
export type UnitInsert = T['praxis_units']['Insert'];
export type UnitUpdate = T['praxis_units']['Update'];

export type ConversationRow = T['praxis_conversations']['Row'];
export type ConversationInsert = T['praxis_conversations']['Insert'];
export type ConversationUpdate = T['praxis_conversations']['Update'];

export type MessageRow = T['praxis_messages']['Row'];
export type MessageInsert = T['praxis_messages']['Insert'];

export type OnboardingRow = T['praxis_onboarding']['Row'];
export type OnboardingInsert = T['praxis_onboarding']['Insert'];
export type OnboardingUpdate = T['praxis_onboarding']['Update'];

export type TemplateRow = T['praxis_templates']['Row'];
export type TemplateInsert = T['praxis_templates']['Insert'];

export type CurriculumCacheRow = T['praxis_curriculum_cache']['Row'];
export type CurriculumCacheInsert = T['praxis_curriculum_cache']['Insert'];

export type UnitCacheRow = T['praxis_unit_cache']['Row'];
export type UnitCacheInsert = T['praxis_unit_cache']['Insert'];

export type SpendLedgerInsert = T['praxis_spend_ledger']['Insert'];

