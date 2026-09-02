CREATE TABLE public.mcp_request_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users ON DELETE CASCADE,
  user_email text,
  client_id text,
  source text NOT NULL DEFAULT 'mcp',
  tool_name text NOT NULL,
  status text NOT NULL DEFAULT 'success',
  duration_ms integer,
  error_message text,
  input jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX mcp_request_logs_created_at_idx ON public.mcp_request_logs (created_at DESC);
CREATE INDEX mcp_request_logs_user_idx ON public.mcp_request_logs (user_id);
CREATE INDEX mcp_request_logs_tool_idx ON public.mcp_request_logs (tool_name);

GRANT SELECT, INSERT ON public.mcp_request_logs TO authenticated;
GRANT ALL ON public.mcp_request_logs TO service_role;
ALTER TABLE public.mcp_request_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users insert their own mcp logs" ON public.mcp_request_logs
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users read their own mcp logs" ON public.mcp_request_logs
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR private.has_role(auth.uid(), 'admin') OR private.has_role(auth.uid(), 'moderator'));

CREATE TABLE public.contact_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  handled boolean NOT NULL DEFAULT false
);

GRANT SELECT, UPDATE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read contact messages" ON public.contact_messages
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin') OR private.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Admins update contact messages" ON public.contact_messages
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));