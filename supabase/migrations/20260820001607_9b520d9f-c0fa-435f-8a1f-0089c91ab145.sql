ALTER TABLE public.infra_requests ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'en';
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'en';
ALTER TABLE public.infra_requests DROP CONSTRAINT IF EXISTS infra_requests_locale_check;
ALTER TABLE public.contact_messages DROP CONSTRAINT IF EXISTS contact_messages_locale_check;
ALTER TABLE public.infra_requests ADD CONSTRAINT infra_requests_locale_check CHECK (locale IN ('en','nl','fr'));
ALTER TABLE public.contact_messages ADD CONSTRAINT contact_messages_locale_check CHECK (locale IN ('en','nl','fr'));