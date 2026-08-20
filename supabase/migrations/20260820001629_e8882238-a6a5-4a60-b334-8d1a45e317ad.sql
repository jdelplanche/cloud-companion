REVOKE ALL ON public.infra_requests FROM anon, authenticated;
REVOKE ALL ON public.contact_messages FROM anon, authenticated;
GRANT ALL ON public.infra_requests TO service_role;
GRANT ALL ON public.contact_messages TO service_role;