-- GPX/FIT Import: ride_tracks table + file_path on rides + storage bucket

-- ride_tracks table (GeoJSON stored separately from rides — 200KB-2MB per track)
CREATE TABLE ride_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_geojson JSONB NOT NULL,
  bounds_ne_lat NUMERIC(9,6),
  bounds_ne_lng NUMERIC(9,6),
  bounds_sw_lat NUMERIC(9,6),
  bounds_sw_lng NUMERIC(9,6),
  point_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ride_tracks_ride_id ON ride_tracks(ride_id);
CREATE INDEX idx_ride_tracks_user_id ON ride_tracks(user_id);

ALTER TABLE ride_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ride tracks"
  ON ride_tracks FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own ride tracks"
  ON ride_tracks FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own ride tracks"
  ON ride_tracks FOR DELETE
  USING (user_id = auth.uid());

-- file_path column on rides for original file reference
ALTER TABLE rides ADD COLUMN IF NOT EXISTS file_path TEXT;

-- Storage bucket gpx-files (private, 10MB)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gpx-files',
  'gpx-files',
  FALSE,
  10485760, -- 10MB
  ARRAY['application/gpx+xml', 'application/xml', 'text/xml', 'application/octet-stream']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies for gpx-files
CREATE POLICY "Users can upload own gpx files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'gpx-files' AND
    (storage.foldername(name))[1] = auth.uid()::TEXT
  );

CREATE POLICY "Users can view own gpx files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'gpx-files' AND
    (storage.foldername(name))[1] = auth.uid()::TEXT
  );

CREATE POLICY "Users can delete own gpx files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'gpx-files' AND
    (storage.foldername(name))[1] = auth.uid()::TEXT
  );
