-- Replaces the "allow everything" policies from the original schema.
-- Run once in the Supabase SQL editor on a database created with the old schema.sql.
-- Before running: create the admin user in Authentication > Users, and turn off
-- "Allow new users to sign up" so nobody else can get a signed-in session.

DROP POLICY IF EXISTS "Allow all hero" ON hero;
DROP POLICY IF EXISTS "Allow all about" ON about;
DROP POLICY IF EXISTS "Allow all skills" ON skills;
DROP POLICY IF EXISTS "Allow all projects" ON projects;
DROP POLICY IF EXISTS "Allow all experiences" ON experiences;
DROP POLICY IF EXISTS "Allow all contacts" ON contacts;
DROP POLICY IF EXISTS "Allow all social_links" ON social_links;
DROP POLICY IF EXISTS "Allow uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete uploads" ON storage.objects;

CREATE POLICY "Admin uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'uploads');
CREATE POLICY "Admin deletes uploads" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'uploads');

-- Visitors can read the public content; only a signed-in admin can change it.
-- Turn off "Allow new users to sign up" in Supabase Auth so the admin is the only account.
CREATE POLICY "Public read hero" ON hero FOR SELECT USING (true);
CREATE POLICY "Public read about" ON about FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Public read social_links" ON social_links FOR SELECT USING (true);

CREATE POLICY "Admin manages hero" ON hero FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manages about" ON about FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manages skills" ON skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manages projects" ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manages experiences" ON experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manages social_links" ON social_links FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Anyone can send a message; only the admin can read, mark or delete messages.
CREATE POLICY "Anyone sends a message" ON contacts FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admin reads messages" ON contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin updates messages" ON contacts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin deletes messages" ON contacts FOR DELETE TO authenticated USING (true);

