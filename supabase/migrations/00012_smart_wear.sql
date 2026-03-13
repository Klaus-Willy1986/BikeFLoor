-- Smart Wear: Extend rides with Strava sport_type + average_speed_kmh
ALTER TABLE rides ADD COLUMN IF NOT EXISTS sport_type TEXT;
ALTER TABLE rides ADD COLUMN IF NOT EXISTS average_speed_kmh NUMERIC(5,2);

-- Bike-Type Wear Defaults: recommended max_distance_km per bike_type + category
CREATE TABLE IF NOT EXISTS bike_type_wear_defaults (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bike_type TEXT NOT NULL,
  category_key TEXT NOT NULL,
  max_distance_km INTEGER NOT NULL,
  UNIQUE(bike_type, category_key)
);

-- RLS: readable by all authenticated users
ALTER TABLE bike_type_wear_defaults ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bike_type_wear_defaults_select"
  ON bike_type_wear_defaults FOR SELECT
  TO authenticated
  USING (true);

-- Seed wear defaults
INSERT INTO bike_type_wear_defaults (bike_type, category_key, max_distance_km) VALUES
  -- Road
  ('road', 'chain', 5000),
  ('road', 'cassette', 10000),
  ('road', 'brake_pads', 3000),
  ('road', 'brake_rotors', 15000),
  ('road', 'tires_front', 6000),
  ('road', 'tires_rear', 5000),
  ('road', 'handlebar_tape', 5000),
  ('road', 'cables', 10000),
  -- MTB
  ('mtb', 'chain', 3000),
  ('mtb', 'cassette', 8000),
  ('mtb', 'brake_pads', 2000),
  ('mtb', 'brake_rotors', 10000),
  ('mtb', 'tires_front', 4000),
  ('mtb', 'tires_rear', 3000),
  ('mtb', 'fork', 5000),
  ('mtb', 'shock', 5000),
  -- Gravel
  ('gravel', 'chain', 4000),
  ('gravel', 'cassette', 10000),
  ('gravel', 'brake_pads', 2500),
  ('gravel', 'brake_rotors', 12000),
  ('gravel', 'tires_front', 5000),
  ('gravel', 'tires_rear', 4000),
  ('gravel', 'handlebar_tape', 5000),
  ('gravel', 'cables', 8000),
  -- City
  ('city', 'chain', 5000),
  ('city', 'brake_pads', 5000),
  ('city', 'tires_front', 8000),
  ('city', 'tires_rear', 7000),
  ('city', 'cables', 10000),
  -- E-Bike
  ('ebike', 'chain', 3000),
  ('ebike', 'cassette', 6000),
  ('ebike', 'brake_pads', 2000),
  ('ebike', 'brake_rotors', 10000),
  ('ebike', 'tires_front', 5000),
  ('ebike', 'tires_rear', 4000),
  -- TT / Triathlon
  ('tt', 'chain', 5000),
  ('tt', 'cassette', 10000),
  ('tt', 'brake_pads', 3000),
  ('tt', 'tires_front', 4000),
  ('tt', 'tires_rear', 3500),
  ('tt', 'handlebar_tape', 5000)
ON CONFLICT (bike_type, category_key) DO NOTHING;
