CREATE TABLE IF NOT EXISTS public.claim_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id uuid NOT NULL REFERENCES public.photos(id) ON DELETE CASCADE,
  claim_code text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'expired')),
  access_token text NOT NULL UNIQUE,
  stripe_checkout_session_id text UNIQUE,
  stripe_payment_intent_id text,
  amount_cents integer,
  currency text,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_claim_orders_session_id
  ON public.claim_orders(stripe_checkout_session_id);

CREATE INDEX IF NOT EXISTS idx_claim_orders_claim_code_created
  ON public.claim_orders(claim_code, created_at DESC);

ALTER TABLE public.claim_orders ENABLE ROW LEVEL SECURITY;
