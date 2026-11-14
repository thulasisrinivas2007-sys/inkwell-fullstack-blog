/*
# Allow public read of profiles for blog author attribution

## Problem
Currently, the SELECT policy on `profiles` is restricted to authenticated users
reading only their own profile (`auth.uid() = id`).
When blogs are displayed on the public home page or blog details page, the join
`select('*, profiles:profiles(full_name, avatar_url)')` returns `null` for `profiles`,
causing the author name to display as 'Unknown'.

## Solution
Allow both `anon` and `authenticated` roles to read `profiles`.
Only public fields exist on `profiles` (full_name, avatar_url, created_at, updated_at).
Sensitive information (such as email, hashed passwords) is safely kept in `auth.users`.

## Changes
1. Grant SELECT on public.profiles to anon, authenticated.
2. Drop policy "profiles_select_own" and create policy "profiles_select_public" allowing SELECT for anon and authenticated.
3. Keep UPDATE policy strictly restricted to own profile (auth.uid() = id).
*/

GRANT SELECT ON public.profiles TO anon, authenticated;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;

CREATE POLICY "profiles_select_public"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (true);
