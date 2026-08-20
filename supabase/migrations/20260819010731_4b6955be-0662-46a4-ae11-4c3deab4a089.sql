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