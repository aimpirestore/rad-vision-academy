# Supabase Setup Guide — RAD Vision Academy

This guide covers the initial database provisioning, schema migration, and environment configuration needed to connect the RAD Vision Academy site to Supabase.

---

## 1. Prerequisites

- A [Supabase](https://supabase.com) project (free tier is sufficient)
- Node.js 18+ and the project checked out locally
- `npm install` already run

---

## 2. Environment Variables

Create or update `.env.local` in the project root with values from your
Supabase dashboard → **Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...   # "anon public" key
SUPABASE_SERVICE_ROLE_KEY=eyJ...       # "service_role secret" key — NEVER commit this
```

| Variable | Used by | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client & Server | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client & Server | Public anon key (safe to expose) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Bypasses RLS — never expose to browser |

> **Important:** `SUPABASE_SERVICE_ROLE_KEY` must NOT start with `NEXT_PUBLIC_` or
> it will be bundled into client JS.

### ⚠️ For Netlify / Vercel deployments

`NEXT_PUBLIC_*` variables are **inlined at build time** by Next.js. This means
they must be present in the **build environment**, not just at runtime.

**Netlify:** Go to **Site settings → Environment variables** and add all three
variables there. Then trigger a new deploy (Netlify → Deploys → Trigger deploy).
If the vars are missing from Netlify, every page will show:
> "Your project's URL and Key are required to create a Supabase client!"

**Vercel:** Go to **Settings → Environment Variables** and add them for
Production, Preview, and Development environments.

> **Tip:** The `.env.local` file works for local `npm run dev` but is NOT
> uploaded during deployment. You MUST configure the hosting platform separately.

---

## 3. Database Schema

The full schema is in `supabase/schema.sql`. It creates:

### Enums
- `admin_role` — `founder`, `editor`, `content_manager`
- `content_status` — `draft`, `published`
- `course_level` — `Beginner`, `Intermediate`, `Advanced`, `All Levels`
- `nav_location` — `header`, `footer`, `quick`

### Tables (19)
| Table | Purpose |
|---|---|
| `admin_users` | Admin accounts (references `auth.users`) |
| `courses` | Course catalog |
| `products` | Digital products / eBooks |
| `posts` | Blog articles |
| `mentorship_services` | 1-on-1 mentorship offerings |
| `resources` | Free downloadable resources |
| `testimonials` | Student testimonials |
| `homepage_settings` | Homepage hero, features, stats |
| `navigation_items` | Header/footer nav links |
| `social_links` | Social media profiles |
| `site_settings` | Brand identity, contact info |
| `seo_settings` | Meta titles, descriptions |
| `analytics_settings` | GA/GTM tracking codes |
| `media` | Uploaded media files |
| `activity_log` | Admin action audit trail |
| `founders` | Team founder profiles |
| `brand_values` | Core brand values |
| `timeline` | Company milestone timeline |
| `faqs` | Frequently asked questions |

### Security (RLS)
- **Public read** on all content tables (only `status = 'published'` rows visible)
- **Admin write** via the `is_admin()` Postgres function (checks `admin_users` role)
- **Storage** — public read on `media` bucket, admin-only upload/update/delete

### Storage Bucket
A `media` bucket is created for file uploads (images, PDFs, etc.).

---

## 4. Running the Migration

### Option A: Supabase Dashboard (SQL Editor)
1. Go to your Supabase project → **SQL Editor**
2. Paste the full contents of `supabase/schema.sql`
3. Click **Run**
4. Verify no errors in the output

### Option B: Supabase CLI
```bash
# Install the CLI if you haven't
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref <your-project-ref>

# Execute the schema
supabase db execute --file supabase/schema.sql
```

---

## 5. Seeding Data

`supabase/seed.sql` contains sample data migrated from the original `src/lib/data/site.ts` static content. Run it after the schema:

```bash
supabase db execute --file supabase/seed.sql
```

Or paste it in the SQL Editor.

---

## 6. Creating the First Admin User

After schema migration, you need at least one admin user to log into `/admin`.

### Step 1: Create a Supabase Auth user
1. Go to **Authentication → Users** in the Supabase dashboard
2. Click **Add user → Create new user**
3. Enter email and a temporary password
4. Check **Auto Confirm User**
5. Click **Create user**

### Step 2: Add to `admin_users` table
Run this SQL (replace the UUID and details):

```sql
INSERT INTO admin_users (id, name, role)
VALUES (
  '<user-uuid-from-step-1>',
  'Your Name',
  'founder'   -- founder has full access; editor and content_manager have restricted access
);
```

### Step 3: Log in
Navigate to `/admin/login` and sign in with the email/password from Step 1.

---

## 7. Architecture Overview

```
src/lib/supabase/
  client.ts       — Browser-side client (anon key, cookie-based session)
  server.ts       — Server Components / Server Actions (anon key)
                     → createServerSupabaseClient()
                     → createAdminClient() (service role, bypasses RLS)
  middleware.ts    — Middleware client for session refresh
  auth.ts         — getAdminUser(), requireAdmin(), requireFounder()

src/middleware.ts  — Refreshes sessions on every request; protects /admin/* routes

src/app/admin/_actions/
  crud.ts         — Generic saveRecord(), deleteRecord(), toggleRecordStatus(), reorderRecords()
  auth.ts         — signInAdmin(), signOutAdmin(), inviteAdmin(), deleteAdmin(), updateAdminRole()
```

### Data Flow
- **Public pages** call async data-layer functions (`src/lib/data/index.ts`) which query Supabase via `createServerSupabaseClient()`. If Supabase is unreachable, they fall back to static data from `site.ts`.
- **Admin pages** are server components that fetch data directly. Client components (`*Manager.tsx`) receive data as props and call server actions for mutations.
- **Middleware** intercepts every request, refreshes the Supabase auth cookie, and redirects unauthenticated users from `/admin/*` to `/admin/login`.

---

## 8. Adding New Content

All content is managed via the admin dashboard at `/admin`. Changes are written directly to Supabase — no code deployment needed. Public pages revalidate on the next request (ISR with `revalidate = 60`).

### Purchases / Payments
Products and courses include a `gumroad_url` field. The "Buy" / "Enroll" buttons on the public site redirect directly to Gumroad. No payment processing happens in this app.

---

## 9. Troubleshooting

| Issue | Fix |
|---|---|
| "Your project's URL and Key are required" | `NEXT_PUBLIC_*` vars are missing from the build environment. Add them in Netlify → Site settings → Environment variables, then redeploy. |
| Admin login redirects back to login | Check that the user exists in `auth.users` AND `admin_users` table |
| "Module not found" build errors | Ensure `@supabase/ssr` is installed and `.env.local` has all 3 keys |
| Public pages show stale content | Content revalidates every 60s; or clear cache in Netlify |
| RLS errors on admin writes | Verify the `is_admin()` function and RLS policies are created in schema.sql |
| Media uploads fail | Check the `media` storage bucket exists and policies allow admin uploads |

---

## 10. Security Checklist

- [x] `SUPABASE_SERVICE_ROLE_KEY` is NOT prefixed with `NEXT_PUBLIC_`
- [x] `.env.local` is in `.gitignore`
- [x] RLS is enabled on all tables
- [x] Admin routes protected by middleware
- [x] Founder-only actions (invite/delete users) check `requireFounder()`
- [x] Admin client (`createAdminClient()`) never used in client components
