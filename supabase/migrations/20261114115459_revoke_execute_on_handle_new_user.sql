/*
# Revoke public execute on handle_new_user trigger function

The `handle_new_user()` SECURITY DEFINER function is a trigger function that
runs automatically when a new auth user is created. It should never be callable
via the REST API by anon or authenticated roles. This migration revokes
EXECUTE from PUBLIC, anon, and authenticated so the function can only be
invoked by the database trigger (which runs with sufficient privileges).

## Changes
- REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated
*/

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;