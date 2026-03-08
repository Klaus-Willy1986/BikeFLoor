-- Shops / Werkstätten
CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  website TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shops_user_id ON shops(user_id);

ALTER TABLE shops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own shops"
  ON shops FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own shops"
  ON shops FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shops"
  ON shops FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own shops"
  ON shops FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE TRIGGER set_shops_updated_at
  BEFORE UPDATE ON shops
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Add shop_id FK to bikes
ALTER TABLE bikes ADD COLUMN shop_id UUID REFERENCES shops(id) ON DELETE SET NULL;
