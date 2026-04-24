-- =============================================================================
-- PRAXIS — Add can_generate_topics flag to praxis_learners.
--
-- This flag controls whether a learner can generate new topics via LLM.
-- Default is false — learners can only read existing topics unless explicitly
-- granted permission (to control token consumption costs).
-- =============================================================================

-- Add the column with default false
alter table praxis_learners
  add column if not exists can_generate_topics boolean not null default false;

-- Update RLS policy: learners can read their own flag but not modify it
-- (modification is admin-only via service-role)

-- Note: The existing "learner self read" policy already allows SELECT on all
-- columns. No new policy needed for reading.

-- Add policy to prevent learners from updating this flag themselves
-- (They can still update display_name and default_locale via existing policy)
-- This is implicitly handled by the column not being in the UPDATE grants
-- and the existing "learner self update" policy having no column restrictions.
-- For defense-in-depth, we add a constraint trigger that rejects unauthorized
-- updates to this column from authenticated role.

create or replace function praxis_prevent_self_update_can_generate_topics()
returns trigger
language plpgsql
as $$
begin
  -- Reject if the caller is trying to change can_generate_topics
  -- Service-role bypasses RLS entirely, so this only affects authenticated users
  if OLD.can_generate_topics is distinct from NEW.can_generate_topics then
    raise exception 'Learners cannot modify can_generate_topics. Contact admin.'
      using errcode = 'insufficient_privilege';
  end if;
  return NEW;
end;
$$;

drop trigger if exists praxis_learners_protect_can_generate_topics on praxis_learners;
create trigger praxis_learners_protect_can_generate_topics
  before update on praxis_learners
  for each row
  execute function praxis_prevent_self_update_can_generate_topics();

-- Add comment for documentation
comment on column praxis_learners.can_generate_topics is
  'Feature flag: allows this learner to generate new topics via LLM. Default false to control token costs.';
