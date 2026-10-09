/*
# Create storage bucket for profile assets

1. Storage
- Create 'profile-assets' bucket (public) for avatars, background images, and album covers
2. Policies
- Public read for all assets in profile-assets bucket
- Authenticated users can upload/update/delete assets
3. Notes
- This bucket stores owner-uploaded images (avatars, backgrounds, album artwork)
- Only the authenticated owner can upload; anyone can view
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-assets', 'profile-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access
DROP POLICY IF EXISTS "public_read_profile_assets" ON storage.objects;
CREATE POLICY "public_read_profile_assets"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'profile-assets');

-- Authenticated can upload
DROP POLICY IF EXISTS "owner_upload_profile_assets" ON storage.objects;
CREATE POLICY "owner_upload_profile_assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-assets');

-- Authenticated can update
DROP POLICY IF EXISTS "owner_update_profile_assets" ON storage.objects;
CREATE POLICY "owner_update_profile_assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-assets')
WITH CHECK (bucket_id = 'profile-assets');

-- Authenticated can delete
DROP POLICY IF EXISTS "owner_delete_profile_assets" ON storage.objects;
CREATE POLICY "owner_delete_profile_assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profile-assets');