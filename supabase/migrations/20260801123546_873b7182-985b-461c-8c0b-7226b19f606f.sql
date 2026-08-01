CREATE TABLE public.email_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  source text NOT NULL DEFAULT 'discount_popup',
  discount_code text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX email_subscribers_email_key ON public.email_subscribers (lower(email));
GRANT INSERT ON public.email_subscribers TO anon;
GRANT INSERT ON public.email_subscribers TO authenticated;
GRANT ALL ON public.email_subscribers TO service_role;
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.email_subscribers FOR INSERT TO anon, authenticated WITH CHECK (
  email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 254
);