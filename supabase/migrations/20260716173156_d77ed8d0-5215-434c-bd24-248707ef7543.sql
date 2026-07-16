
REVOKE EXECUTE ON FUNCTION public.is_banned(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_banned(uuid) TO service_role;
