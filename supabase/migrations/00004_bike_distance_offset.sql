-- Add distance_offset_km for pre-existing distance (e.g. imported from Strava)
ALTER TABLE bikes ADD COLUMN distance_offset_km NUMERIC(10,2) NOT NULL DEFAULT 0;

-- Update recalculate function to include offset
CREATE OR REPLACE FUNCTION recalculate_bike_distance(bike_id_input UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE bikes
  SET total_distance_km = distance_offset_km + COALESCE(
    (SELECT SUM(distance_km) FROM rides WHERE bike_id = bike_id_input AND NOT is_indoor),
    0
  )
  WHERE id = bike_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
