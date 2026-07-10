
-- 1) Restrict profiles reads to the owning user
DROP POLICY IF EXISTS "Profiles are readable by anyone" ON public.profiles;
REVOKE SELECT ON public.profiles FROM anon;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- 2) Move has_role out of the exposed API schema
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO anon, authenticated, service_role;

-- 3) Repoint all policies from public.has_role to private.has_role
-- articles
DROP POLICY IF EXISTS "Anyone can read published articles" ON public.articles;
DROP POLICY IF EXISTS "Admins can insert articles" ON public.articles;
DROP POLICY IF EXISTS "Admins can update articles" ON public.articles;
DROP POLICY IF EXISTS "Admins can delete articles" ON public.articles;

CREATE POLICY "Public can read published articles"
  ON public.articles FOR SELECT TO anon
  USING (status = 'published');
CREATE POLICY "Authenticated can read articles"
  ON public.articles FOR SELECT TO authenticated
  USING (status = 'published' OR private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert articles"
  ON public.articles FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update articles"
  ON public.articles FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete articles"
  ON public.articles FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));

-- tools
DROP POLICY IF EXISTS "Admins can insert tools" ON public.tools;
DROP POLICY IF EXISTS "Admins can update tools" ON public.tools;
DROP POLICY IF EXISTS "Admins can delete tools" ON public.tools;
CREATE POLICY "Admins can insert tools" ON public.tools FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update tools" ON public.tools FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete tools" ON public.tools FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));

-- prompts
DROP POLICY IF EXISTS "Admins can insert prompts" ON public.prompts;
DROP POLICY IF EXISTS "Admins can update prompts" ON public.prompts;
DROP POLICY IF EXISTS "Admins can delete prompts" ON public.prompts;
CREATE POLICY "Admins can insert prompts" ON public.prompts FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update prompts" ON public.prompts FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete prompts" ON public.prompts FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));

-- newsletter_subscribers
DROP POLICY IF EXISTS "Admins can view subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can view subscribers"
  ON public.newsletter_subscribers FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));

-- 4) Drop the public-schema has_role now that nothing depends on it
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

-- 5) Keep the app-code RPC call site working: server code calls supabase.rpc('has_role', ...)
-- Provide a thin public wrapper that delegates to private.has_role, marked SECURITY INVOKER
-- so it does not itself get flagged as a definer bypass.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT private.has_role(_user_id, _role)
$$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
