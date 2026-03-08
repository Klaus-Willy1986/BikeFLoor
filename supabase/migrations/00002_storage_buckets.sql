-- Storage Buckets for BikeFloor

-- Bike photos bucket (max 5MB, images only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'bike-photos',
  'bike-photos',
  TRUE,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Documents bucket (max 10MB, images + PDF)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  FALSE,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
);

-- Storage policies for bike-photos
CREATE POLICY "Users can upload own bike photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'bike-photos' AND
    (storage.foldername(name))[1] = auth.uid()::TEXT
  );

CREATE POLICY "Users can view own bike photos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'bike-photos' AND
    (storage.foldername(name))[1] = auth.uid()::TEXT
  );

CREATE POLICY "Users can delete own bike photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'bike-photos' AND
    (storage.foldername(name))[1] = auth.uid()::TEXT
  );

CREATE POLICY "Public can view bike photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'bike-photos');

-- Storage policies for documents
CREATE POLICY "Users can upload own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] = auth.uid()::TEXT
  );

CREATE POLICY "Users can view own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] = auth.uid()::TEXT
  );

CREATE POLICY "Users can delete own documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] = auth.uid()::TEXT
  );
