-- Replace partial unique index with a proper unique constraint for upsert support
DROP INDEX IF EXISTS idx_rides_strava_activity;
ALTER TABLE rides ADD CONSTRAINT rides_strava_activity_id_unique UNIQUE (strava_activity_id);
