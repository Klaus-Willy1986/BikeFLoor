-- Add subscription and admin fields to profiles
ALTER TABLE profiles ADD COLUMN role TEXT NOT NULL DEFAULT 'user';
ALTER TABLE profiles ADD COLUMN plan TEXT NOT NULL DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN stripe_customer_id TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN stripe_subscription_id TEXT;
ALTER TABLE profiles ADD COLUMN subscription_status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE profiles ADD COLUMN current_period_end TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN is_early_bird BOOLEAN NOT NULL DEFAULT FALSE;
