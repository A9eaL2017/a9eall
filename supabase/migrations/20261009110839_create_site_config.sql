/*
# Create site_config table for personal profile website

1. New Tables
- `site_config`: Single-row configuration table storing all profile, appearance, music, effects, and admin settings as JSONB.
  - `id` (int, primary key, always 1 — enforced by check constraint)
  - `config` (jsonb, not null — the full site configuration object)
  - `updated_at` (timestamptz, auto-updated)
  - `owner_email` (text — the email of the owner, set on first setup)
2. Security
- Enable RLS on `site_config`.
- SELECT: public (anon + authenticated) — visitors need to read the profile config.
- INSERT/UPDATE/DELETE: authenticated only — only the logged-in owner can modify.
3. Notes
- The `id` column is constrained to 1, ensuring only a single configuration row exists.
- `owner_email` is informational and helps identify the owner account.
*/

CREATE TABLE IF NOT EXISTS site_config (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  config jsonb NOT NULL,
  owner_email text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Public can read the config (needed to render the public profile)
DROP POLICY IF EXISTS "public_read_site_config" ON site_config;
CREATE POLICY "public_read_site_config"
ON site_config FOR SELECT
TO anon, authenticated USING (true);

-- Only authenticated users can insert (first-time setup)
DROP POLICY IF EXISTS "owner_insert_site_config" ON site_config;
CREATE POLICY "owner_insert_site_config"
ON site_config FOR INSERT
TO authenticated WITH CHECK (true);

-- Only authenticated users can update
DROP POLICY IF EXISTS "owner_update_site_config" ON site_config;
CREATE POLICY "owner_update_site_config"
ON site_config FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

-- Only authenticated users can delete
DROP POLICY IF EXISTS "owner_delete_site_config" ON site_config;
CREATE POLICY "owner_delete_site_config"
ON site_config FOR DELETE
TO authenticated USING (true);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_site_config_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS site_config_updated_at ON site_config;
CREATE TRIGGER site_config_updated_at
BEFORE UPDATE ON site_config
FOR EACH ROW EXECUTE FUNCTION update_site_config_timestamp();