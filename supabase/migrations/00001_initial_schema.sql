-- BikeFloor Initial Schema
-- All tables with RLS enabled

-- Enable UUID extension
-- gen_random_uuid() is built-in on Supabase Cloud (pgcrypto)

-- ============================================
-- PROFILES
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  locale TEXT NOT NULL DEFAULT 'de',
  units TEXT NOT NULL DEFAULT 'metric',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- BIKES
-- ============================================
CREATE TABLE bikes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'road',
  manufacturer TEXT,
  model TEXT,
  year INTEGER,
  weight_kg NUMERIC(5,2),
  total_distance_km NUMERIC(10,2) NOT NULL DEFAULT 0,
  photo_url TEXT,
  notes TEXT,
  strava_gear_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bikes_user_id ON bikes(user_id);

ALTER TABLE bikes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bikes" ON bikes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bikes" ON bikes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bikes" ON bikes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bikes" ON bikes FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- COMPONENT CATEGORIES (predefined)
-- ============================================
CREATE TABLE component_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  default_max_distance_km INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- No RLS needed, these are global read-only
ALTER TABLE component_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read categories" ON component_categories FOR SELECT USING (true);

INSERT INTO component_categories (key, default_max_distance_km, sort_order) VALUES
  ('chain', 5000, 1),
  ('cassette', 10000, 2),
  ('brake_pads', 3000, 3),
  ('brake_rotors', 15000, 4),
  ('tires_front', 5000, 5),
  ('tires_rear', 4000, 6),
  ('handlebar_tape', 5000, 7),
  ('cables', 10000, 8),
  ('bottom_bracket', 20000, 9),
  ('headset', 30000, 10),
  ('wheels_front', 30000, 11),
  ('wheels_rear', 25000, 12),
  ('fork', NULL, 13),
  ('shock', NULL, 14),
  ('dropper_post', NULL, 15),
  ('pedals', NULL, 16),
  ('saddle', NULL, 17),
  ('other', NULL, 18);

-- ============================================
-- COMPONENTS
-- ============================================
CREATE TABLE components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bike_id UUID NOT NULL REFERENCES bikes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES component_categories(id),
  name TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  distance_at_install_km NUMERIC(10,2) NOT NULL DEFAULT 0,
  current_distance_km NUMERIC(10,2) NOT NULL DEFAULT 0,
  max_distance_km INTEGER,
  installed_at DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_components_bike_id ON components(bike_id);
CREATE INDEX idx_components_user_id ON components(user_id);

ALTER TABLE components ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own components" ON components FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own components" ON components FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own components" ON components FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own components" ON components FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- COMPONENT HISTORY
-- ============================================
CREATE TABLE component_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_id UUID NOT NULL REFERENCES components(id) ON DELETE CASCADE,
  from_bike_id UUID REFERENCES bikes(id) ON DELETE SET NULL,
  to_bike_id UUID REFERENCES bikes(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'installed', 'removed', 'swapped'
  distance_at_action_km NUMERIC(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_component_history_component_id ON component_history(component_id);

ALTER TABLE component_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own component history" ON component_history
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM components WHERE components.id = component_history.component_id AND components.user_id = auth.uid())
  );
CREATE POLICY "Users can insert own component history" ON component_history
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM components WHERE components.id = component_history.component_id AND components.user_id = auth.uid())
  );

-- ============================================
-- SERVICE INTERVALS
-- ============================================
CREATE TABLE service_intervals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bike_id UUID NOT NULL REFERENCES bikes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  interval_type TEXT NOT NULL, -- 'distance', 'hours', 'days'
  interval_value INTEGER NOT NULL,
  last_performed_at TIMESTAMPTZ,
  last_performed_distance_km NUMERIC(10,2),
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_service_intervals_bike_id ON service_intervals(bike_id);

ALTER TABLE service_intervals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own intervals" ON service_intervals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own intervals" ON service_intervals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own intervals" ON service_intervals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own intervals" ON service_intervals FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- SERVICE RECORDS
-- ============================================
CREATE TABLE service_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_interval_id UUID REFERENCES service_intervals(id) ON DELETE SET NULL,
  bike_id UUID NOT NULL REFERENCES bikes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  performed_at DATE NOT NULL DEFAULT CURRENT_DATE,
  distance_at_service_km NUMERIC(10,2),
  cost NUMERIC(10,2),
  consumables TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_service_records_bike_id ON service_records(bike_id);

ALTER TABLE service_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own records" ON service_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own records" ON service_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own records" ON service_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own records" ON service_records FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- BIKE SETUP
-- ============================================
CREATE TABLE bike_setup (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bike_id UUID NOT NULL REFERENCES bikes(id) ON DELETE CASCADE UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Tire pressure
  tire_pressure_front NUMERIC(4,1),
  tire_pressure_rear NUMERIC(4,1),
  tire_width_front NUMERIC(4,1),
  tire_width_rear NUMERIC(4,1),
  tire_type TEXT,
  -- Fork
  fork_pressure NUMERIC(5,1),
  fork_rebound INTEGER,
  fork_compression INTEGER,
  fork_sag_percent NUMERIC(4,1),
  fork_travel_mm INTEGER,
  -- Shock
  shock_pressure NUMERIC(5,1),
  shock_rebound INTEGER,
  shock_compression INTEGER,
  shock_sag_percent NUMERIC(4,1),
  shock_travel_mm INTEGER,
  -- Bike Fit
  seat_height_mm NUMERIC(6,1),
  stem_length_mm NUMERIC(5,1),
  stem_angle NUMERIC(4,1),
  handlebar_width_mm NUMERIC(5,1),
  crank_length_mm NUMERIC(5,1),
  stack_mm NUMERIC(6,1),
  reach_mm NUMERIC(6,1),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE bike_setup ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own setup" ON bike_setup FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own setup" ON bike_setup FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own setup" ON bike_setup FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own setup" ON bike_setup FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- STRAVA CONNECTIONS
-- ============================================
CREATE TABLE strava_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  strava_athlete_id BIGINT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expires_at TIMESTAMPTZ NOT NULL,
  last_sync_at TIMESTAMPTZ,
  exclude_indoor BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE strava_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own strava" ON strava_connections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own strava" ON strava_connections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own strava" ON strava_connections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own strava" ON strava_connections FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- RIDES
-- ============================================
CREATE TABLE rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bike_id UUID REFERENCES bikes(id) ON DELETE SET NULL,
  strava_activity_id BIGINT,
  title TEXT,
  distance_km NUMERIC(10,2) NOT NULL DEFAULT 0,
  duration_seconds INTEGER,
  elevation_m INTEGER,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT NOT NULL DEFAULT 'manual', -- 'manual' | 'strava'
  is_indoor BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rides_user_id ON rides(user_id);
CREATE INDEX idx_rides_bike_id ON rides(bike_id);
CREATE INDEX idx_rides_date ON rides(date);
CREATE UNIQUE INDEX idx_rides_strava_activity ON rides(strava_activity_id) WHERE strava_activity_id IS NOT NULL;

ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own rides" ON rides FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own rides" ON rides FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own rides" ON rides FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own rides" ON rides FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- DOCUMENTS
-- ============================================
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bike_id UUID REFERENCES bikes(id) ON DELETE SET NULL,
  component_id UUID REFERENCES components(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  document_type TEXT NOT NULL DEFAULT 'other',
  file_size_bytes INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_bike_id ON documents(bike_id);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own documents" ON documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own documents" ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own documents" ON documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own documents" ON documents FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, locale)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name', COALESCE(NEW.raw_user_meta_data->>'locale', 'de'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_bikes_updated_at BEFORE UPDATE ON bikes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_components_updated_at BEFORE UPDATE ON components FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_service_intervals_updated_at BEFORE UPDATE ON service_intervals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_bike_setup_updated_at BEFORE UPDATE ON bike_setup FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_strava_connections_updated_at BEFORE UPDATE ON strava_connections FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Recalculate bike distance from rides
CREATE OR REPLACE FUNCTION recalculate_bike_distance(bike_id_input UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE bikes
  SET total_distance_km = COALESCE(
    (SELECT SUM(distance_km) FROM rides WHERE bike_id = bike_id_input AND NOT is_indoor),
    0
  )
  WHERE id = bike_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to recalculate bike distance on ride changes
CREATE OR REPLACE FUNCTION trigger_recalculate_bike_distance()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF OLD.bike_id IS NOT NULL THEN
      PERFORM recalculate_bike_distance(OLD.bike_id);
    END IF;
    RETURN OLD;
  ELSE
    IF NEW.bike_id IS NOT NULL THEN
      PERFORM recalculate_bike_distance(NEW.bike_id);
    END IF;
    -- If bike changed, recalculate old bike too
    IF TG_OP = 'UPDATE' AND OLD.bike_id IS NOT NULL AND OLD.bike_id != NEW.bike_id THEN
      PERFORM recalculate_bike_distance(OLD.bike_id);
    END IF;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_ride_change
  AFTER INSERT OR UPDATE OR DELETE ON rides
  FOR EACH ROW
  EXECUTE FUNCTION trigger_recalculate_bike_distance();

-- Recalculate component wear
CREATE OR REPLACE FUNCTION recalculate_component_wear(component_id_input UUID)
RETURNS VOID AS $$
DECLARE
  v_bike_id UUID;
  v_bike_distance NUMERIC;
  v_install_distance NUMERIC;
BEGIN
  SELECT bike_id, distance_at_install_km INTO v_bike_id, v_install_distance
  FROM components WHERE id = component_id_input;

  SELECT total_distance_km INTO v_bike_distance
  FROM bikes WHERE id = v_bike_id;

  UPDATE components
  SET current_distance_km = GREATEST(v_bike_distance - v_install_distance, 0)
  WHERE id = component_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update component wear when bike distance changes
CREATE OR REPLACE FUNCTION trigger_recalculate_components_wear()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.total_distance_km != OLD.total_distance_km THEN
    UPDATE components
    SET current_distance_km = GREATEST(NEW.total_distance_km - distance_at_install_km, 0)
    WHERE bike_id = NEW.id AND is_active = TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_bike_distance_change
  AFTER UPDATE ON bikes
  FOR EACH ROW
  EXECUTE FUNCTION trigger_recalculate_components_wear();
