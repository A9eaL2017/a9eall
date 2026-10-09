update storage.buckets
set allowed_mime_types = array[
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'audio/mpeg'
]
where id = 'profile-assets';
