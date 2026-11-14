# Project memory

## Product intent & audience

- Blog application: authors publish posts; readers browse, search, and filter by category.
- Authenticated users get a dashboard and profile; guests can read.

## Brand personality & voice

- Modern, production-quality, polished (not generic). Tone inferred as clean/professional.

## Visual design & UX direction

- Pages confirmed: Home, Dashboard, BlogDetails, Profile.
- Responsive layout; Tailwind CSS + JSX + lucide-react icons (per project conventions).
- Author info embedded on blog listings/details (full name, avatar).

## Decisions, constraints & rationale

- Stack: Vite + React, Node/Express, Supabase (Postgres + Auth + RLS).
- DB schema:
  - `profiles.id` ↔ `auth.users(id)` (profile ID = authenticated user ID).
  - `blogs.user_id` → `profiles.id` foreign key added with `ON DELETE CASCADE` to fix Supabase "no relationship" error.
  - `profiles` columns in use: `full_name`, `avatar_url`.
- Supabase join pattern: `profiles:profiles(full_name, avatar_url)` embed alias; now resolves via FK.
- Constraints: never delete existing tables/data/accounts; preserve RLS policies; refresh schema cache after migrations; avoid new UI/icon/theme packages.
- Frontend modules imported via `@/` path alias (`src/`).

## Open questions & assumptions

- Express role vs Supabase direct client not fully clarified; assume Supabase JS client used for auth/CRUD on frontend.
- `blogs` columns beyond `user_id` (title, content, category, search fields) assumed standard but not verified.
- RLS policy contents not inspected this turn.
- Search implementation (client vs server) unconfirmed.