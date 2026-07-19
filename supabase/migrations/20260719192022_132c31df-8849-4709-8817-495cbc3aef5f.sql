
-- Fix RLS_POLICY_ALWAYS_TRUE: replace WITH CHECK (true) on leads inserts with input validation
DROP POLICY IF EXISTS leads_auth_insert ON public.leads;
DROP POLICY IF EXISTS leads_anon_insert ON public.leads;

CREATE POLICY leads_anon_insert ON public.leads
  FOR INSERT TO anon
  WITH CHECK (
    name IS NOT NULL AND length(btrim(name)) BETWEEN 1 AND 120
    AND (
      (email IS NOT NULL AND length(email) BETWEEN 3 AND 254 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
      OR (phone IS NOT NULL AND length(btrim(phone)) BETWEEN 6 AND 20)
    )
    AND (message IS NULL OR length(message) <= 2000)
  );

CREATE POLICY leads_auth_insert ON public.leads
  FOR INSERT TO authenticated
  WITH CHECK (
    name IS NOT NULL AND length(btrim(name)) BETWEEN 1 AND 120
    AND (
      (email IS NOT NULL AND length(email) BETWEEN 3 AND 254 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
      OR (phone IS NOT NULL AND length(btrim(phone)) BETWEEN 6 AND 20)
    )
    AND (message IS NULL OR length(message) <= 2000)
  );
