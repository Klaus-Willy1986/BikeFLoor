-- Add missing UPDATE policy for bike-photos storage (needed for upsert)
CREATE POLICY "Users can update own bike photos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'bike-photos' AND
    (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- Add missing UPDATE policy for documents storage
CREATE POLICY "Users can update own documents" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] = auth.uid()::TEXT
  );
