REVOKE SELECT, UPDATE, DELETE ON public.email_subscribers FROM anon, authenticated;
GRANT INSERT ON public.email_subscribers TO anon, authenticated;
GRANT ALL ON public.email_subscribers TO service_role;