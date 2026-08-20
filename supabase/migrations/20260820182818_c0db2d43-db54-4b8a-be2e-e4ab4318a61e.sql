CREATE TABLE public.infra_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket TEXT NOT NULL UNIQUE,
  org TEXT NOT NULL,
  domain TEXT NOT NULL,
  stack TEXT NOT NULL,
  account_status TEXT NOT NULL DEFAULT 'existing',
  notes TEXT,
  contact_email TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  reply TEXT,
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.infra_requests TO service_role;
ALTER TABLE public.infra_requests ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  reply TEXT,
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.infra_requests ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'en';
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'en';
ALTER TABLE public.infra_requests ADD CONSTRAINT infra_requests_locale_check CHECK (locale IN ('en','nl','fr'));
ALTER TABLE public.contact_messages ADD CONSTRAINT contact_messages_locale_check CHECK (locale IN ('en','nl','fr'));

REVOKE ALL ON public.infra_requests FROM anon, authenticated;
REVOKE ALL ON public.contact_messages FROM anon, authenticated;
GRANT ALL ON public.infra_requests TO service_role;
GRANT ALL ON public.contact_messages TO service_role;