-- Add crankset category
INSERT INTO component_categories (key, default_max_distance_km, sort_order)
VALUES ('crankset', 30000, 16)
ON CONFLICT (key) DO NOTHING;

-- Shift pedals, saddle, other to make room
UPDATE component_categories SET sort_order = 17 WHERE key = 'pedals';
UPDATE component_categories SET sort_order = 18 WHERE key = 'saddle';
UPDATE component_categories SET sort_order = 19 WHERE key = 'other';
