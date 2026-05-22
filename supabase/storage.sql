-- Supabase Storage Setup for Aadhar Photos
-- Run this in Supabase SQL Editor after creating the schema

-- Create a storage bucket for Aadhar photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'aadhar-photos',
  'aadhar-photos',
  true,  -- Public bucket so images can be viewed
  5242880,  -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'aadhar-photos');

-- Allow anyone to view files (public bucket)
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'aadhar-photos');

-- Allow authenticated users to update their uploads
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'aadhar-photos');

-- Allow authenticated users to delete files
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'aadhar-photos');
