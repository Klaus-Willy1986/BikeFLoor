-- Ensure documents bucket and policies exist (idempotent)
-- Safeguard in case migration 00002 partially failed on prod

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  FALSE,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Re-create policies with IF NOT EXISTS
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can upload own documents' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Users can upload own documents" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = 'documents' AND
        (storage.foldername(name))[1] = auth.uid()::TEXT
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own documents' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Users can view own documents" ON storage.objects
      FOR SELECT USING (
        bucket_id = 'documents' AND
        (storage.foldername(name))[1] = auth.uid()::TEXT
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own documents' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Users can delete own documents" ON storage.objects
      FOR DELETE USING (
        bucket_id = 'documents' AND
        (storage.foldername(name))[1] = auth.uid()::TEXT
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own documents' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Users can update own documents" ON storage.objects
      FOR UPDATE USING (
        bucket_id = 'documents' AND
        (storage.foldername(name))[1] = auth.uid()::TEXT
      );
  END IF;
END $$;
