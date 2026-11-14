# Inkwell — Full-Stack Blog Application

![Inkwell](https://img.shields.io/badge/Inkwell-Modern%20Blog%20Platform-1c6ef5?style=for-the-badge&logo=bookstack&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase)

A modern, full-stack blogging platform where writers can share stories, explore content by category, and manage their own blog posts — all backed by a robust Supabase backend with real-time data and Row Level Security.

---

## ✨ Features

- 🏠 **Professional Landing Page** — Hero section with CTA, blog grid, search & category filters
- 🔐 **Authentication** — Secure sign-up, sign-in and sign-out via Supabase Auth
- 🛡️ **Protected Routes** — Dashboard, Create Blog, Edit Blog and Profile require authentication
- 📊 **User Dashboard** — Personal blog management with stats (total, published, member since)
- ✍️ **Create Blog** — Full-featured blog editor with title, description, content, category, featured image URL and publish toggle
- 📖 **View All Blogs** — Public home page with real-time search and category filtering
- ✏️ **Edit Blog** — Owners can update their own posts; unauthorized edits are blocked
- 🗑️ **Delete Blog** — Soft-confirm delete dialog; only the owner can delete their post
- 🔍 **Search & Filters** — Live search across title, description and content; filter by category
- 👤 **User Profile** — Edit display name and avatar URL; view your publishing activity
- 📱 **Responsive Design** — Mobile, tablet and desktop layouts using Tailwind CSS
- 🔔 **Toast Notifications** — Success/error/info feedback for every user action
- 🏷️ **Categories** — Technology, Education, Programming, AI, Lifestyle, Travel, Sports, Other
- 🔒 **Row Level Security** — Supabase RLS policies enforce data ownership at the database level

---

## 🛠 Technologies Used

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS 3 |
| Routing | React Router DOM v7 |
| Icons | Lucide React |
| Backend | Supabase (PostgreSQL + Auth + RLS) |
| Build Tool | Vite 7 |
| Type Safety | TypeScript 5.5 |

---

## 📁 Project Folder Structure

```
project/
├── public/
├── src/
│   ├── components/
│   │   ├── BlogCard.tsx          # Reusable blog card with optional actions
│   │   ├── BlogForm.tsx          # Shared create/edit form
│   │   ├── ConfirmDialog.tsx     # Delete confirmation modal
│   │   ├── EmptyState.tsx        # Empty state placeholder
│   │   ├── Layout.tsx            # App shell (Navbar + Footer + Outlet)
│   │   ├── LoadingSpinner.tsx    # Animated loader
│   │   ├── Navbar.tsx            # Responsive navigation bar
│   │   └── ProtectedRoute.tsx   # Auth guard for private routes
│   ├── context/
│   │   ├── AuthContext.tsx       # Auth state: session, user, profile, signIn/Up/Out
│   │   └── NotificationContext.tsx # Toast notification system
│   ├── lib/
│   │   └── supabaseClient.ts    # Supabase client initialization
│   ├── pages/
│   │   ├── BlogDetails.tsx      # Full blog view with owner actions
│   │   ├── CreateBlog.tsx       # New blog form
│   │   ├── Dashboard.tsx        # User's personal blog management
│   │   ├── EditBlog.tsx         # Edit an existing blog
│   │   ├── Home.tsx             # Public landing + blog listing
│   │   ├── Login.tsx            # Sign-in form
│   │   ├── NotFound.tsx         # 404 page
│   │   ├── Profile.tsx          # Edit profile + blog activity
│   │   └── Register.tsx         # Sign-up form
│   ├── types/
│   │   └── index.ts             # Shared TypeScript interfaces & constants
│   ├── utils/
│   │   └── format.ts            # Date, text, and color helpers
│   ├── App.tsx                  # Route definitions
│   ├── index.css                # Tailwind directives + custom styles
│   └── main.tsx                 # React root render
├── supabase/
│   └── migrations/              # SQL migration files for schema & RLS
├── .env                         # Environment variables (NOT committed)
├── .env.example                 # Template for required env vars
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.app.json
└── vite.config.ts
```

---

## 🚀 Installation Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- [npm](https://www.npmjs.com/) v9 or later
- A [Supabase](https://supabase.com) account and project

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/inkwell-fullstack-blog.git
cd inkwell-fullstack-blog
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

> ⚠️ **Never commit your `.env` file.** It is listed in `.gitignore`.

### 4. Set up Supabase

See the [Supabase Configuration](#-supabase-configuration) section below.

### 5. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔑 Environment Variable Setup

| Variable | Description | Where to find |
|----------|-------------|---------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon (public) key | Supabase Dashboard → Settings → API → `anon` `public` |

Create a `.env.example` file (safe to commit) with placeholder values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## 🗄️ Supabase Configuration

### Tables

The database uses two tables:

**`profiles`**
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (PK) | References `auth.users(id)` |
| `full_name` | text | Set from user metadata on signup |
| `avatar_url` | text (nullable) | External image URL |
| `created_at` | timestamptz | Auto |
| `updated_at` | timestamptz | Auto |

**`blogs`**
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (PK) | Auto-generated |
| `user_id` | uuid | References `auth.users(id)` and `profiles(id)` |
| `title` | text | Required |
| `description` | text | Short summary (max 300 chars) |
| `content` | text | Full blog body |
| `category` | text | One of 8 allowed categories |
| `featured_image` | text (nullable) | External image URL |
| `published` | boolean | `true` = public; `false` = draft |
| `created_at` | timestamptz | Auto |
| `updated_at` | timestamptz | Auto |

### Running Migrations

Migrations are in `supabase/migrations/`. Run them in order via the Supabase SQL Editor or the Supabase CLI:

```bash
# Using Supabase CLI
supabase db push
```

Or manually paste each `.sql` file into **Supabase Dashboard → SQL Editor → New Query**.

### Row Level Security Policies

| Table | Operation | Rule |
|-------|-----------|------|
| `profiles` | SELECT | Only own row (`auth.uid() = id`) |
| `profiles` | UPDATE | Only own row |
| `blogs` | SELECT | Published blogs (anon + authenticated) OR own blogs |
| `blogs` | INSERT | Only with `user_id = auth.uid()` |
| `blogs` | UPDATE | Only own blogs |
| `blogs` | DELETE | Only own blogs |

### Auto-Profile Creation

A `handle_new_user` trigger function automatically inserts a row in `profiles` whenever a new user registers, using `raw_user_meta_data->>'full_name'`.

---

## ▶️ How to Run the Application

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at `http://localhost:5173` |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

---

## 📸 Screenshots

> _Coming soon — screenshots will be added after deployment._

| Page | Description |
|------|-------------|
| Home | Landing hero + blog grid with search & filters |
| Login / Register | Clean auth forms with validation |
| Dashboard | Personal blog management with stats |
| Create / Edit Blog | Full-featured editor with preview |
| Blog Details | Full-width article with owner actions |
| Profile | Edit name, avatar, view blog activity |

---

## 🔮 Future Improvements

- [ ] Rich text / Markdown editor (e.g., TipTap, MDX)
- [ ] Image upload directly to Supabase Storage (instead of URL-only)
- [ ] Comment system on blog posts
- [ ] Like / bookmark functionality
- [ ] Author public profiles (view all posts by a writer)
- [ ] Email notifications via Supabase Edge Functions
- [ ] Admin panel for content moderation
- [ ] SEO improvements (dynamic meta tags, sitemap)
- [ ] Dark mode
- [ ] PWA support

---

## 📄 License

MIT — feel free to use, modify and distribute.

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

Made with ❤️ using React, TypeScript, Tailwind CSS and Supabase.
