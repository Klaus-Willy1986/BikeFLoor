-- Community Bike Templates
-- Stores bike configurations contributed by users + migrated catalog data

CREATE TABLE bike_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manufacturer TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  type TEXT NOT NULL DEFAULT 'road',
  weight_kg NUMERIC(4,1),
  image_url TEXT,
  components JSONB NOT NULL DEFAULT '[]',
  -- Community data
  contributor_count INTEGER NOT NULL DEFAULT 1,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  source TEXT NOT NULL DEFAULT 'community',  -- 'community' | 'catalog' | 'manufacturer'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unique constraint: one template per manufacturer+model+year
CREATE UNIQUE INDEX idx_bike_templates_unique
  ON bike_templates (LOWER(manufacturer), LOWER(model), COALESCE(year, 0));

-- Full-text search index
CREATE INDEX idx_bike_templates_search
  ON bike_templates USING GIN (to_tsvector('simple', manufacturer || ' ' || model));

-- Auto-update updated_at
CREATE TRIGGER set_bike_templates_updated_at
  BEFORE UPDATE ON bike_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE bike_templates ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read templates
CREATE POLICY "Authenticated users can read templates"
  ON bike_templates FOR SELECT
  USING (auth.role() = 'authenticated');

-- No direct client writes — only via service role / API routes

-- ═══════════════════════════════════════════════════
-- SEED: Migrate static BIKE_CATALOG (310 bikes)
-- ═══════════════════════════════════════════════════

INSERT INTO bike_templates (manufacturer, model, year, type, weight_kg, source, is_verified, components) VALUES
-- === BASSO ===
('Basso', 'Palta III', 2025, 'gravel', 7.9, 'catalog', FALSE, '[]'),
('Basso', 'Palta II', 2023, 'gravel', 8.2, 'catalog', FALSE, '[]'),
('Basso', 'Palta', 2021, 'gravel', 8.5, 'catalog', FALSE, '[]'),
('Basso', 'SV (Sempre Veloce)', 2025, 'road', 6.8, 'catalog', TRUE,
  '[{"category_key":"chain","name":"Kette","brand":"Shimano","model":"Ultegra 12v","max_distance_km":5000},{"category_key":"cassette","name":"Kassette","brand":"Shimano","model":"Ultegra 12v (11-32)","max_distance_km":10000},{"category_key":"bottom_bracket","name":"Tretlager","brand":"Shimano","model":"Ultegra","max_distance_km":20000},{"category_key":"brake_pads","name":"Bremsbeläge","brand":"Shimano","model":"Ultegra","max_distance_km":3000},{"category_key":"brake_rotors","name":"Bremsscheiben","brand":"Shimano","model":"Ultegra 160mm","max_distance_km":15000},{"category_key":"wheels_front","name":"Vorderrad","brand":"DT Swiss","model":"ARC 1100 50","max_distance_km":30000},{"category_key":"wheels_rear","name":"Hinterrad","brand":"DT Swiss","model":"ARC 1100 50","max_distance_km":25000},{"category_key":"handlebar_tape","name":"Lenkerband","max_distance_km":5000},{"category_key":"headset","name":"Steuersatz","brand":"Microtech","model":"Integrated Cables Solid Oil","max_distance_km":30000},{"category_key":"saddle","name":"Sattelstütze","brand":"Basso","model":"Diamante 2023"}]'),
('Basso', 'Diamante', 2025, 'road', 7.2, 'catalog', FALSE, '[]'),
('Basso', 'Astra', 2025, 'road', 7.5, 'catalog', FALSE, '[]'),
('Basso', 'Venta', 2025, 'road', 7.8, 'catalog', FALSE, '[]'),
('Basso', 'Tera', 2025, 'gravel', 9.0, 'catalog', FALSE, '[]'),

-- === CANYON ===
('Canyon', 'Aeroad CF SLX', 2025, 'road', 7.0, 'catalog', FALSE, '[]'),
('Canyon', 'Aeroad CF SL', 2025, 'road', 7.6, 'catalog', FALSE, '[]'),
('Canyon', 'Ultimate CF SLX', 2025, 'road', 6.5, 'catalog', FALSE, '[]'),
('Canyon', 'Ultimate CF SL', 2025, 'road', 7.2, 'catalog', FALSE, '[]'),
('Canyon', 'Endurace CF SLX', 2025, 'road', 7.4, 'catalog', FALSE, '[]'),
('Canyon', 'Endurace CF SL', 2025, 'road', 7.9, 'catalog', FALSE, '[]'),
('Canyon', 'Endurace AL', 2025, 'road', 9.0, 'catalog', FALSE, '[]'),
('Canyon', 'Grail CF SLX', 2025, 'gravel', 7.6, 'catalog', FALSE, '[]'),
('Canyon', 'Grail CF SL', 2025, 'gravel', 8.2, 'catalog', FALSE, '[]'),
('Canyon', 'Grail AL', 2025, 'gravel', 9.5, 'catalog', FALSE, '[]'),
('Canyon', 'Grizl CF SLX', 2025, 'gravel', 8.0, 'catalog', FALSE, '[]'),
('Canyon', 'Grizl CF SL', 2025, 'gravel', 8.6, 'catalog', FALSE, '[]'),
('Canyon', 'Spectral CF', 2025, 'mtb', 13.5, 'catalog', FALSE, '[]'),
('Canyon', 'Spectral AL', 2025, 'mtb', 14.8, 'catalog', FALSE, '[]'),
('Canyon', 'Neuron CF', 2025, 'mtb', 12.5, 'catalog', FALSE, '[]'),
('Canyon', 'Neuron AL', 2025, 'mtb', 13.8, 'catalog', FALSE, '[]'),
('Canyon', 'Exceed CF', 2025, 'mtb', 9.8, 'catalog', FALSE, '[]'),
('Canyon', 'Lux Trail CF', 2025, 'mtb', 11.2, 'catalog', FALSE, '[]'),
('Canyon', 'Strive CF', 2025, 'mtb', 14.5, 'catalog', FALSE, '[]'),
('Canyon', 'Torque CF', 2025, 'mtb', 16.0, 'catalog', FALSE, '[]'),
('Canyon', 'Roadlite CF', 2025, 'city', 8.5, 'catalog', FALSE, '[]'),
('Canyon', 'Commuter', 2025, 'city', 11.0, 'catalog', FALSE, '[]'),

-- === SPECIALIZED ===
('Specialized', 'Tarmac SL8', 2025, 'road', 6.7, 'catalog', FALSE, '[]'),
('Specialized', 'Tarmac SL7', 2022, 'road', 6.9, 'catalog', FALSE, '[]'),
('Specialized', 'Aethos', 2025, 'road', 6.1, 'catalog', FALSE, '[]'),
('Specialized', 'Roubaix', 2025, 'road', 8.2, 'catalog', FALSE, '[]'),
('Specialized', 'Allez Sprint', 2025, 'road', 8.0, 'catalog', FALSE, '[]'),
('Specialized', 'Diverge STR', 2025, 'gravel', 9.2, 'catalog', FALSE, '[]'),
('Specialized', 'Diverge Expert', 2025, 'gravel', 9.0, 'catalog', FALSE, '[]'),
('Specialized', 'Crux', 2025, 'gravel', 7.5, 'catalog', FALSE, '[]'),
('Specialized', 'Epic 8', 2025, 'mtb', 10.2, 'catalog', FALSE, '[]'),
('Specialized', 'Epic EVO', 2025, 'mtb', 11.5, 'catalog', FALSE, '[]'),
('Specialized', 'Stumpjumper', 2025, 'mtb', 13.0, 'catalog', FALSE, '[]'),
('Specialized', 'Stumpjumper EVO', 2025, 'mtb', 13.8, 'catalog', FALSE, '[]'),
('Specialized', 'Enduro', 2025, 'mtb', 15.0, 'catalog', FALSE, '[]'),
('Specialized', 'Demo', 2025, 'mtb', 16.5, 'catalog', FALSE, '[]'),
('Specialized', 'Levo SL', 2025, 'ebike', 17.3, 'catalog', FALSE, '[]'),
('Specialized', 'Turbo Levo', 2025, 'ebike', 21.5, 'catalog', FALSE, '[]'),
('Specialized', 'Turbo Creo', 2025, 'ebike', 12.2, 'catalog', FALSE, '[]'),
('Specialized', 'Turbo Vado', 2025, 'ebike', 21.0, 'catalog', FALSE, '[]'),

-- === TREK ===
('Trek', 'Madone SLR', 2025, 'road', 7.3, 'catalog', FALSE, '[]'),
('Trek', 'Madone SL', 2025, 'road', 8.0, 'catalog', FALSE, '[]'),
('Trek', 'Emonda SLR', 2025, 'road', 6.6, 'catalog', FALSE, '[]'),
('Trek', 'Emonda SL', 2025, 'road', 7.8, 'catalog', FALSE, '[]'),
('Trek', 'Domane SLR', 2025, 'road', 7.9, 'catalog', FALSE, '[]'),
('Trek', 'Domane SL', 2025, 'road', 8.5, 'catalog', FALSE, '[]'),
('Trek', 'Domane AL', 2025, 'road', 9.7, 'catalog', FALSE, '[]'),
('Trek', 'Checkpoint SLR', 2025, 'gravel', 8.0, 'catalog', FALSE, '[]'),
('Trek', 'Checkpoint SL', 2025, 'gravel', 8.9, 'catalog', FALSE, '[]'),
('Trek', 'Supercaliber', 2025, 'mtb', 10.5, 'catalog', FALSE, '[]'),
('Trek', 'Top Fuel', 2025, 'mtb', 11.5, 'catalog', FALSE, '[]'),
('Trek', 'Fuel EX', 2025, 'mtb', 13.5, 'catalog', FALSE, '[]'),
('Trek', 'Slash', 2025, 'mtb', 15.0, 'catalog', FALSE, '[]'),
('Trek', 'Remedy', 2025, 'mtb', 14.5, 'catalog', FALSE, '[]'),
('Trek', 'Rail', 2025, 'ebike', 22.5, 'catalog', FALSE, '[]'),
('Trek', 'Fuel EXe', 2025, 'ebike', 18.5, 'catalog', FALSE, '[]'),

-- === GIANT ===
('Giant', 'TCR Advanced SL', 2025, 'road', 6.7, 'catalog', FALSE, '[]'),
('Giant', 'TCR Advanced Pro', 2025, 'road', 7.3, 'catalog', FALSE, '[]'),
('Giant', 'Propel Advanced SL', 2025, 'road', 7.1, 'catalog', FALSE, '[]'),
('Giant', 'Defy Advanced Pro', 2025, 'road', 7.8, 'catalog', FALSE, '[]'),
('Giant', 'Revolt Advanced', 2025, 'gravel', 8.8, 'catalog', FALSE, '[]'),
('Giant', 'Trance X', 2025, 'mtb', 13.8, 'catalog', FALSE, '[]'),
('Giant', 'Anthem', 2025, 'mtb', 11.0, 'catalog', FALSE, '[]'),
('Giant', 'Reign', 2025, 'mtb', 15.5, 'catalog', FALSE, '[]'),

-- === SCOTT ===
('Scott', 'Addict RC', 2025, 'road', 6.8, 'catalog', FALSE, '[]'),
('Scott', 'Foil RC', 2025, 'road', 7.2, 'catalog', FALSE, '[]'),
('Scott', 'Speedster', 2025, 'road', 8.8, 'catalog', FALSE, '[]'),
('Scott', 'Addict Gravel', 2025, 'gravel', 8.0, 'catalog', FALSE, '[]'),
('Scott', 'Spark RC', 2025, 'mtb', 10.5, 'catalog', FALSE, '[]'),
('Scott', 'Spark', 2025, 'mtb', 12.0, 'catalog', FALSE, '[]'),
('Scott', 'Genius', 2025, 'mtb', 14.0, 'catalog', FALSE, '[]'),
('Scott', 'Ransom', 2025, 'mtb', 15.5, 'catalog', FALSE, '[]'),

-- === CERVÉLO ===
('Cervélo', 'S5', 2025, 'road', 7.3, 'catalog', FALSE, '[]'),
('Cervélo', 'R5', 2025, 'road', 6.6, 'catalog', FALSE, '[]'),
('Cervélo', 'Caledonia-5', 2025, 'road', 7.6, 'catalog', FALSE, '[]'),
('Cervélo', 'Caledonia', 2025, 'road', 8.0, 'catalog', FALSE, '[]'),
('Cervélo', 'Áspero', 2025, 'gravel', 8.0, 'catalog', FALSE, '[]'),
('Cervélo', 'Rouvida', 2025, 'gravel', 8.5, 'catalog', FALSE, '[]'),

-- === PINARELLO ===
('Pinarello', 'Dogma F', 2025, 'road', 6.9, 'catalog', FALSE, '[]'),
('Pinarello', 'Dogma X', 2025, 'road', 7.4, 'catalog', FALSE, '[]'),
('Pinarello', 'F Series', 2025, 'road', 7.5, 'catalog', FALSE, '[]'),
('Pinarello', 'Paris', 2025, 'road', 8.2, 'catalog', FALSE, '[]'),
('Pinarello', 'Grevil F', 2025, 'gravel', 8.0, 'catalog', FALSE, '[]'),

-- === COLNAGO ===
('Colnago', 'V4Rs', 2025, 'road', 6.6, 'catalog', FALSE, '[]'),
('Colnago', 'C68', 2025, 'road', 6.9, 'catalog', FALSE, '[]'),
('Colnago', 'G4-X', 2025, 'gravel', 8.2, 'catalog', FALSE, '[]'),

-- === BMC ===
('BMC', 'Teammachine SLR', 2025, 'road', 6.7, 'catalog', FALSE, '[]'),
('BMC', 'Roadmachine', 2025, 'road', 7.8, 'catalog', FALSE, '[]'),
('BMC', 'Timemachine Road', 2025, 'road', 8.0, 'catalog', FALSE, '[]'),
('BMC', 'Kaius', 2025, 'gravel', 8.0, 'catalog', FALSE, '[]'),
('BMC', 'URS', 2025, 'gravel', 8.5, 'catalog', FALSE, '[]'),
('BMC', 'Fourstroke', 2025, 'mtb', 10.8, 'catalog', FALSE, '[]'),
('BMC', 'Speedfox', 2025, 'mtb', 12.5, 'catalog', FALSE, '[]'),

-- === FACTOR ===
('Factor', 'Ostro VAM', 2025, 'road', 6.8, 'catalog', FALSE, '[]'),
('Factor', 'O2 VAM', 2025, 'road', 6.4, 'catalog', FALSE, '[]'),
('Factor', 'LS', 2025, 'gravel', 8.0, 'catalog', FALSE, '[]'),

-- === ROSE ===
('Rose', 'Xlite', 2025, 'road', 7.4, 'catalog', FALSE, '[]'),
('Rose', 'Reveal', 2025, 'road', 7.8, 'catalog', FALSE, '[]'),
('Rose', 'Backroad', 2025, 'gravel', 8.2, 'catalog', FALSE, '[]'),
('Rose', 'Backroad AL', 2025, 'gravel', 9.5, 'catalog', FALSE, '[]'),
('Rose', 'Ground Control', 2025, 'mtb', 13.0, 'catalog', FALSE, '[]'),

-- === CUBE ===
('Cube', 'Litening C:68X', 2025, 'road', 7.0, 'catalog', FALSE, '[]'),
('Cube', 'Agree C:62', 2025, 'road', 8.0, 'catalog', FALSE, '[]'),
('Cube', 'Attain GTC', 2025, 'road', 8.5, 'catalog', FALSE, '[]'),
('Cube', 'Nuroad C:62', 2025, 'gravel', 8.5, 'catalog', FALSE, '[]'),
('Cube', 'Stereo ONE77', 2025, 'mtb', 14.0, 'catalog', FALSE, '[]'),
('Cube', 'AMS', 2025, 'mtb', 12.5, 'catalog', FALSE, '[]'),
('Cube', 'Stereo Hybrid', 2025, 'ebike', 23.0, 'catalog', FALSE, '[]'),
('Cube', 'Reaction Hybrid', 2025, 'ebike', 22.0, 'catalog', FALSE, '[]'),

-- === FOCUS ===
('Focus', 'Izalco Max', 2025, 'road', 7.0, 'catalog', FALSE, '[]'),
('Focus', 'Atlas', 2025, 'gravel', 8.5, 'catalog', FALSE, '[]'),
('Focus', 'Jam2', 2025, 'ebike', 22.5, 'catalog', FALSE, '[]'),

-- === MERIDA ===
('Merida', 'Scultura', 2025, 'road', 7.2, 'catalog', FALSE, '[]'),
('Merida', 'Reacto', 2025, 'road', 7.5, 'catalog', FALSE, '[]'),
('Merida', 'Silex', 2025, 'gravel', 8.8, 'catalog', FALSE, '[]'),
('Merida', 'One-Twenty', 2025, 'mtb', 13.0, 'catalog', FALSE, '[]'),
('Merida', 'One-Forty', 2025, 'mtb', 14.0, 'catalog', FALSE, '[]'),
('Merida', 'One-Sixty', 2025, 'mtb', 15.0, 'catalog', FALSE, '[]'),

-- === CANNONDALE ===
('Cannondale', 'SuperSix EVO', 2025, 'road', 7.2, 'catalog', FALSE, '[]'),
('Cannondale', 'SystemSix', 2025, 'road', 7.8, 'catalog', FALSE, '[]'),
('Cannondale', 'Synapse', 2025, 'road', 8.5, 'catalog', FALSE, '[]'),
('Cannondale', 'CAAD13', 2025, 'road', 8.3, 'catalog', FALSE, '[]'),
('Cannondale', 'Topstone Carbon', 2025, 'gravel', 8.5, 'catalog', FALSE, '[]'),
('Cannondale', 'Topstone', 2025, 'gravel', 9.5, 'catalog', FALSE, '[]'),
('Cannondale', 'Scalpel', 2025, 'mtb', 10.5, 'catalog', FALSE, '[]'),
('Cannondale', 'Habit', 2025, 'mtb', 13.5, 'catalog', FALSE, '[]'),
('Cannondale', 'Jekyll', 2025, 'mtb', 15.0, 'catalog', FALSE, '[]'),
('Cannondale', 'Moterra', 2025, 'ebike', 23.0, 'catalog', FALSE, '[]'),

-- === RIBBLE ===
('Ribble', 'Endurance SL R', 2025, 'road', 7.5, 'catalog', FALSE, '[]'),
('Ribble', 'Ultra SL R', 2025, 'road', 6.8, 'catalog', FALSE, '[]'),
('Ribble', 'CGR SL', 2025, 'gravel', 8.5, 'catalog', FALSE, '[]'),

-- === ORBEA ===
('Orbea', 'Orca', 2025, 'road', 7.2, 'catalog', FALSE, '[]'),
('Orbea', 'Terra', 2025, 'gravel', 8.5, 'catalog', FALSE, '[]'),
('Orbea', 'Oiz', 2025, 'mtb', 10.5, 'catalog', FALSE, '[]'),
('Orbea', 'Occam', 2025, 'mtb', 13.0, 'catalog', FALSE, '[]'),
('Orbea', 'Rallon', 2025, 'mtb', 15.0, 'catalog', FALSE, '[]'),
('Orbea', 'Rise', 2025, 'ebike', 16.5, 'catalog', FALSE, '[]'),
('Orbea', 'Wild', 2025, 'ebike', 22.5, 'catalog', FALSE, '[]'),
('Orbea', 'Gain', 2025, 'ebike', 12.5, 'catalog', FALSE, '[]'),

-- === SANTA CRUZ ===
('Santa Cruz', 'Blur', 2025, 'mtb', 10.5, 'catalog', FALSE, '[]'),
('Santa Cruz', 'Tallboy', 2025, 'mtb', 12.8, 'catalog', FALSE, '[]'),
('Santa Cruz', 'Hightower', 2025, 'mtb', 13.5, 'catalog', FALSE, '[]'),
('Santa Cruz', 'Bronson', 2025, 'mtb', 14.5, 'catalog', FALSE, '[]'),
('Santa Cruz', 'Megatower', 2025, 'mtb', 15.5, 'catalog', FALSE, '[]'),
('Santa Cruz', 'Nomad', 2025, 'mtb', 16.0, 'catalog', FALSE, '[]'),
('Santa Cruz', 'Stigmata', 2025, 'gravel', 8.5, 'catalog', FALSE, '[]'),

-- === YT ===
('YT', 'Szepter', 2025, 'road', 7.2, 'catalog', FALSE, '[]'),
('YT', 'Izzo', 2025, 'mtb', 12.5, 'catalog', FALSE, '[]'),
('YT', 'Jeffsy', 2025, 'mtb', 14.0, 'catalog', FALSE, '[]'),
('YT', 'Capra', 2025, 'mtb', 15.5, 'catalog', FALSE, '[]'),
('YT', 'Decoy', 2025, 'ebike', 22.0, 'catalog', FALSE, '[]'),

-- === PROPAIN ===
('Propain', 'Hugene', 2025, 'mtb', 12.5, 'catalog', FALSE, '[]'),
('Propain', 'Tyee', 2025, 'mtb', 14.0, 'catalog', FALSE, '[]'),
('Propain', 'Spindrift', 2025, 'mtb', 16.0, 'catalog', FALSE, '[]'),
('Propain', 'Ekano', 2025, 'ebike', 22.0, 'catalog', FALSE, '[]'),

-- === LAST ===
('Last', 'Glen', 2025, 'mtb', 13.5, 'catalog', FALSE, '[]'),
('Last', 'Tarvo', 2025, 'mtb', 14.5, 'catalog', FALSE, '[]'),
('Last', 'Coal', 2025, 'mtb', 15.5, 'catalog', FALSE, '[]'),

-- === RADON ===
('Radon', 'Vaillant', 2025, 'road', 7.5, 'catalog', FALSE, '[]'),
('Radon', 'Cragger', 2025, 'gravel', 9.0, 'catalog', FALSE, '[]'),
('Radon', 'Slide Trail', 2025, 'mtb', 13.5, 'catalog', FALSE, '[]'),
('Radon', 'Swoop', 2025, 'mtb', 15.5, 'catalog', FALSE, '[]'),
('Radon', 'Jealous', 2025, 'mtb', 10.5, 'catalog', FALSE, '[]'),

-- === WILIER ===
('Wilier', 'Filante SLR', 2025, 'road', 6.9, 'catalog', FALSE, '[]'),
('Wilier', 'Zero SLR', 2025, 'road', 6.5, 'catalog', FALSE, '[]'),
('Wilier', 'Rave SLR', 2025, 'gravel', 7.8, 'catalog', FALSE, '[]'),
('Wilier', 'Urta SLR', 2025, 'mtb', 10.5, 'catalog', FALSE, '[]'),

-- === LOOK ===
('Look', '795 Blade RS', 2025, 'road', 7.0, 'catalog', FALSE, '[]'),
('Look', '785 Huez RS', 2025, 'road', 6.5, 'catalog', FALSE, '[]'),

-- === RIDLEY ===
('Ridley', 'Falcn RS', 2025, 'road', 7.2, 'catalog', FALSE, '[]'),
('Ridley', 'Noah', 2025, 'road', 7.5, 'catalog', FALSE, '[]'),
('Ridley', 'Kanzo Fast', 2025, 'gravel', 8.0, 'catalog', FALSE, '[]'),
('Ridley', 'Kanzo Adventure', 2025, 'gravel', 9.0, 'catalog', FALSE, '[]'),

-- === DE ROSA ===
('De Rosa', 'SK Pininfarina', 2025, 'road', 7.2, 'catalog', FALSE, '[]'),
('De Rosa', 'Merak', 2025, 'road', 6.8, 'catalog', FALSE, '[]'),

-- === 3T ===
('3T', 'Exploro Max', 2025, 'gravel', 8.5, 'catalog', FALSE, '[]'),
('3T', 'Exploro Race', 2025, 'gravel', 8.0, 'catalog', FALSE, '[]'),
('3T', 'Strada', 2025, 'road', 7.5, 'catalog', FALSE, '[]'),

-- === OPEN ===
('Open', 'U.P.', 2025, 'gravel', 8.0, 'catalog', FALSE, '[]'),
('Open', 'W.I.D.E.', 2025, 'gravel', 8.5, 'catalog', FALSE, '[]'),

-- === LAPIERRE ===
('Lapierre', 'Xelius SL', 2025, 'road', 7.2, 'catalog', FALSE, '[]'),
('Lapierre', 'Aircode DRS', 2025, 'road', 7.5, 'catalog', FALSE, '[]'),
('Lapierre', 'Crosshill', 2025, 'gravel', 8.8, 'catalog', FALSE, '[]'),
('Lapierre', 'Zesty', 2025, 'mtb', 14.0, 'catalog', FALSE, '[]'),
('Lapierre', 'Spicy', 2025, 'mtb', 15.0, 'catalog', FALSE, '[]'),

-- === BULLS ===
('Bulls', 'Sonic EVO', 2025, 'ebike', 21.0, 'catalog', FALSE, '[]'),
('Bulls', 'Copperhead EVO', 2025, 'ebike', 22.5, 'catalog', FALSE, '[]'),

-- === HAIBIKE ===
('Haibike', 'AllMtn', 2025, 'ebike', 25.0, 'catalog', FALSE, '[]'),
('Haibike', 'AllTrail', 2025, 'ebike', 24.0, 'catalog', FALSE, '[]'),
('Haibike', 'Lyke', 2025, 'ebike', 18.0, 'catalog', FALSE, '[]'),

-- === KALKHOFF ===
('Kalkhoff', 'Endeavour', 2025, 'ebike', 26.0, 'catalog', FALSE, '[]'),
('Kalkhoff', 'Image', 2025, 'ebike', 27.0, 'catalog', FALSE, '[]'),

-- === RIESE & MÜLLER ===
('Riese & Müller', 'Supercharger', 2025, 'ebike', 30.0, 'catalog', FALSE, '[]'),
('Riese & Müller', 'Homage', 2025, 'ebike', 29.0, 'catalog', FALSE, '[]'),
('Riese & Müller', 'Nevo', 2025, 'ebike', 26.0, 'catalog', FALSE, '[]'),
('Riese & Müller', 'Charger', 2025, 'ebike', 28.0, 'catalog', FALSE, '[]'),

-- === COWBOY / SCHINDELHAUER / AMPLER ===
('Cowboy', 'Cruiser', 2025, 'ebike', 19.0, 'catalog', FALSE, '[]'),
('Cowboy', 'Classic', 2025, 'ebike', 18.9, 'catalog', FALSE, '[]'),
('Schindelhauer', 'Arthur', 2025, 'city', 11.0, 'catalog', FALSE, '[]'),
('Schindelhauer', 'Viktor', 2025, 'city', 12.0, 'catalog', FALSE, '[]'),
('Ampler', 'Curt', 2025, 'ebike', 14.0, 'catalog', FALSE, '[]'),
('Ampler', 'Stout', 2025, 'ebike', 16.0, 'catalog', FALSE, '[]');
