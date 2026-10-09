/*
# Enable owner-only uploads to the public profile-assets bucket
*/

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profile-assets', 'profile-assets', true, 26214400, array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

update public.site_config
set owner_email = (select lower(email) from auth.users where email is not null order by created_at limit 1)
where id = 1 and owner_email is null and exists (select 1 from auth.users where email is not null);

drop policy if exists profile_assets_owner_upload on storage.objects;
create policy profile_assets_owner_upload on storage.objects for insert to authenticated
with check (bucket_id = 'profile-assets' and exists (select 1 from public.site_config where id = 1 and lower(owner_email) = lower((select auth.jwt() ->> 'email'))));

drop policy if exists profile_assets_owner_read on storage.objects;
create policy profile_assets_owner_read on storage.objects for select to authenticated
using (bucket_id = 'profile-assets' and exists (select 1 from public.site_config where id = 1 and lower(owner_email) = lower((select auth.jwt() ->> 'email'))));

drop policy if exists profile_assets_owner_update on storage.objects;
create policy profile_assets_owner_update on storage.objects for update to authenticated
using (bucket_id = 'profile-assets' and exists (select 1 from public.site_config where id = 1 and lower(owner_email) = lower((select auth.jwt() ->> 'email'))))
with check (bucket_id = 'profile-assets' and exists (select 1 from public.site_config where id = 1 and lower(owner_email) = lower((select auth.jwt() ->> 'email'))));

drop policy if exists profile_assets_owner_delete on storage.objects;
create policy profile_assets_owner_delete on storage.objects for delete to authenticated
using (bucket_id = 'profile-assets' and exists (select 1 from public.site_config where id = 1 and lower(owner_email) = lower((select auth.jwt() ->> 'email'))));
