/*
# Create profiles and blogs tables for the blog application

## 1. New Tables

### profiles
- `id` (uuid, primary key, references auth.users on delete cascade)
- `full_name` (text, not null)
- `avatar_url` (text, nullable — URL to a profile image)
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

### blogs
- `id` (uuid, primary key, default gen_random_uuid())
- `user_id` (uuid, not null, default auth.uid(), references auth.users on delete cascade)
- `title` (text, not null)
- `description` (text, not null — short summary)
- `content` (text, not null — full blog body)
- `category` (text, not null — one of the allowed category values)
- `featured_image` (text, nullable — URL to a featured image)
- `published` (boolean, default true)
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

## 2. Indexes
- `blogs_user_id_idx` on blogs.user_id — speeds up dashboard queries
- `blogs_category_idx` on blogs.category — speeds up category filtering
- `blogs_created_at_idx` on blogs.created_at DESC — speeds up newest-first ordering
- `blogs_published_idx` on blogs.published — speeds up filtering published blogs

## 3. Security (RLS)

### profiles
- Enable RLS.
- SELECT: authenticated users can read their own profile only.
- UPDATE: authenticated users can update their own profile only.
- No INSERT or DELETE on profiles — rows are created/managed by the trigger from auth.users.
- Grant SELECT, UPDATE to authenticated.

### blogs
- Enable RLS.
- SELECT: anon and authenticated can read published blogs (public home page); authenticated users can also read their own unpublished blogs.
- INSERT: authenticated users can insert blogs where user_id = auth.uid().
- UPDATE: authenticated users can update only their own blogs (USING + WITH CHECK both enforce user_id = auth.uid()).
- DELETE: authenticated users can delete only their own blogs.
- Grant SELECT to anon, authenticated; INSERT, UPDATE, DELETE to authenticated.

## 4. Trigger
- `handle_new_user` function + trigger on auth.users: when a new auth user is created, automatically insert a corresponding row in profiles with the user's id and the full_name from raw_user_meta_data.

## 5. Important Notes
- The `user_id` column on blogs has `DEFAULT auth.uid()` so frontend inserts that omit user_id still satisfy the INSERT WITH CHECK.
- profiles rows are auto-created by the trigger — the frontend never inserts into profiles directly.
- Email confirmation is OFF (default) so sign-up immediately creates a usable session.
*/

-- ─── profiles table ───
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, UPDATE ON public.profiles TO authenticated;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ─── blogs table ───
CREATE TABLE IF NOT EXISTS public.blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'Other',
  featured_image text,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS blogs_user_id_idx ON public.blogs(user_id);
CREATE INDEX IF NOT EXISTS blogs_category_idx ON public.blogs(category);
CREATE INDEX IF NOT EXISTS blogs_created_at_idx ON public.blogs(created_at DESC);
CREATE INDEX IF NOT EXISTS blogs_published_idx ON public.blogs(published);

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Public can read published blogs; authenticated can also read their own (incl. unpublished)
GRANT SELECT ON public.blogs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blogs TO authenticated;

DROP POLICY IF EXISTS "blogs_select_public_or_own" ON public.blogs;
CREATE POLICY "blogs_select_public_or_own"
  ON public.blogs FOR SELECT
  TO anon, authenticated
  USING (published = true OR auth.uid() = user_id);

DROP POLICY IF EXISTS "blogs_insert_own" ON public.blogs;
CREATE POLICY "blogs_insert_own"
  ON public.blogs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "blogs_update_own" ON public.blogs;
CREATE POLICY "blogs_update_own"
  ON public.blogs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "blogs_delete_own" ON public.blogs;
CREATE POLICY "blogs_delete_own"
  ON public.blogs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ─── auto-create profile on signup ───
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();