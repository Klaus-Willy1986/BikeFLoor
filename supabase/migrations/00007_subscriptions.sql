-- Add subscription and admin fields to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_early_bird BOOLEAN NOT NULL DEFAULT FALSE;

-- Add unique constraint on stripe_customer_id if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_stripe_customer_id_key'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_stripe_customer_id_key UNIQUE (stripe_customer_id);
  END IF;
END $$;
