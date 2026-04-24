-- =============================================================================
-- PRAXIS — Fix can_generate_topics trigger to allow admin edits.
--
-- The original trigger blocked ALL updates to can_generate_topics, including
-- legitimate admin edits via Supabase dashboard. This revision allows:
--   - postgres role (direct DB access)
--   - supabase_admin / supabase_auth_admin roles (system)
--   - Any role with BYPASSRLS attribute (effectively service role)
--
-- Learners (authenticated role) are still blocked from self-modification.
-- =============================================================================

-- Drop the old trigger function
drop trigger if exists praxis_learners_protect_can_generate_topics on praxis_learners;
drop function if exists praxis_prevent_self_update_can_generate_topics();

-- Create a more permissive version that allows admin updates
create or replace function praxis_prevent_self_update_can_generate_topics()
returns trigger
language plpgsql
as $$
declare
  is_privileged boolean;
begin
  -- Check if current user is privileged (postgres, admin, or has BYPASSRLS)
  -- These roles can modify the column; authenticated learners cannot.
  is_privileged := (
    current_user = 'postgres' 
    or current_user like 'supabase_%admin'
    or pg_has_role(current_user, 'service_role', 'MEMBER')
    or (select rolbypassrls from pg_roles where rolname = current_user)
  );

  if not is_privileged and OLD.can_generate_topics is distinct from NEW.can_generate_topics then
    raise exception 'Learners cannot modify can_generate_topics. Contact admin.'
      using errcode = 'insufficient_privilege';
  end if;
  
  return NEW;
end;
$$;

-- Recreate the trigger
create trigger praxis_learners_protect_can_generate_topics
  before update on praxis_learners
  for each row
  execute function praxis_prevent_self_update_can_generate_topics();

-- Also ensure the service_role can bypass this entirely via RLS exemption
-- (service_role already bypasses RLS, but let's add explicit grant for clarity)
grant all on praxis_learners to service_role;
