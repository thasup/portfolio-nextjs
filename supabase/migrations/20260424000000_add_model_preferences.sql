-- =============================================================================
-- PRAXIS — Add per-learner model preferences
--
-- Allows learners to override the default LLM model per task via UI dropdown.
-- Stored as JSONB for flexibility; null values fall back to env defaults.
-- =============================================================================

-- Add model_preferences column to praxis_learners
alter table praxis_learners
add column if not exists model_preferences jsonb null
  check (jsonb_typeof(model_preferences) = 'object' or model_preferences is null);

-- Add comment explaining the structure
comment on column praxis_learners.model_preferences is
  'Per-task model overrides: {guardrail?: string, curriculum?: string, unit?: string, onboarding?: string, judge?: string}';

-- Update RLS policy to allow learners to update their own model_preferences
-- (already covered by existing "learner self update" policy, but ensure it's explicit)
drop policy if exists "learner self update prefs" on praxis_learners;
create policy "learner self update prefs" on praxis_learners
  for update using (auth.uid() = id)
  with check (auth.uid() = id);
