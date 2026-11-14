/*
# Add foreign key from blogs.user_id to profiles.id

## Problem
The frontend queries blogs with a join to profiles:
  .from('blogs').select('*, profiles:profiles(full_name, avatar_url)')

Supabase's PostgREST looks for a foreign key between the two tables to
determine the join path. Both `blogs.user_id` and `profiles.id` reference
`auth.users(id)`, but there is no FK from `blogs` → `profiles`. PostgREST
cannot infer the relationship, producing:
  "Could not find a relationship between 'blogs' and 'profiles' in the schema cache."

## Fix
Add a second foreign key on `blogs.user_id` that references `profiles.id`.
A column can participate in multiple FK constraints, so the existing
`blogs_user_id_fkey` → `auth.users(id)` is preserved. The new FK lets
PostgREST resolve the blogs→profiles join.

## Changes
1. Add FK constraint `blogs_user_id_profiles_fkey`:
   `blogs.user_id` → `profiles.id` ON DELETE CASCADE
2. No data is modified, no tables are dropped or recreated.
3. RLS policies and existing constraints remain unchanged.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_schema = 'public'
      AND table_name = 'blogs'
      AND constraint_name = 'blogs_user_id_profiles_fkey'
  ) THEN
    ALTER TABLE public.blogs
      ADD CONSTRAINT blogs_user_id_profiles_fkey
      FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;