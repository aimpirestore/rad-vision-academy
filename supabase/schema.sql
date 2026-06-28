-- ============================================================
-- RAD Vision Academy — Supabase Database Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

create type admin_role as enum ('founder', 'editor', 'content_manager');
create type content_status as enum ('draft', 'published');
create type course_level as enum ('Beginner', 'Intermediate', 'Advanced', 'All Levels');
create type nav_location as enum ('header', 'footer', 'quick');

-- ============================================================
-- TABLES
-- ============================================================

-- Admin users (linked to Supabase Auth)
create table admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  role admin_role not null default 'content_manager',
  created_at timestamptz not null default now()
);

-- Courses
create table courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  instructor text not null default '',
  duration text not null default '',
  level course_level not null default 'All Levels',
  category text not null default '',
  blurb text not null default '',
  description text not null default '',
  highlights jsonb not null default '[]'::jsonb,
  price text not null default '',
  gumroad_url text not null default '',
  image_url text not null default '',
  status content_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

-- Digital products
create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null default '',
  blurb text not null default '',
  price text not null default '',
  format text not null default '',
  cover_url text not null default '',
  preview_urls jsonb not null default '[]'::jsonb,
  gumroad_url text not null default '',
  featured boolean not null default false,
  status content_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Blog posts
create table posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  category text not null default '',
  tags text[] not null default '{}',
  author text not null default '',
  reading_time text not null default '',
  featured_image text not null default '',
  seo_title text not null default '',
  meta_description text not null default '',
  status content_status not null default 'draft',
  featured boolean not null default false,
  scheduled_for timestamptz,
  created_at timestamptz not null default now(),
  published_at timestamptz
);

-- Mentorship services
create table mentorship_services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null default '',
  duration text not null default '',
  price text not null default '',
  benefits jsonb not null default '[]'::jsonb,
  requirements jsonb not null default '[]'::jsonb,
  icon text not null default '',
  image_url text not null default '',
  gumroad_url text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Resources
create table resources (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  type text not null default '',
  description text not null default '',
  file_url text not null default '',
  free boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Testimonials
create table testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  name text not null,
  role text not null default '',
  sort_order integer not null default 0
);

-- Homepage settings (single row)
create table homepage_settings (
  id integer primary key default 1 check (id = 1),
  hero_heading text not null default 'World-Class Radiology Education',
  hero_subheading text not null default 'Empowering Future Radiologists Through Expert Education, Mentorship, Digital Learning, and AI-Powered Learning Resources.',
  hero_cta_primary_label text not null default 'Explore Courses',
  hero_cta_primary_href text not null default '/courses',
  hero_cta_secondary_label text not null default 'Book Consultation',
  hero_cta_secondary_href text not null default '/contact',
  stats jsonb not null default '[]'::jsonb,
  featured_course_slugs text[] not null default '{}'
);

-- Navigation items
create table navigation_items (
  id uuid primary key default gen_random_uuid(),
  location nav_location not null,
  label text not null,
  href text not null,
  sort_order integer not null default 0,
  external boolean not null default false
);

-- Social links (single row)
create table social_links (
  id integer primary key default 1 check (id = 1),
  facebook text not null default '',
  instagram text not null default '',
  linkedin text not null default '',
  twitter text not null default '',
  youtube text not null default '',
  tiktok text not null default '',
  whatsapp text not null default '',
  email text not null default '',
  phone text not null default ''
);

-- Site settings (single row)
create table site_settings (
  id integer primary key default 1 check (id = 1),
  brand_name text not null default 'RAD Vision Academy',
  tagline text not null default 'International Medical Education',
  logo_url text not null default '',
  favicon_url text not null default '',
  email text not null default '',
  phone text not null default '',
  address text not null default '',
  footer_copyright text not null default '',
  newsletter_text text not null default ''
);

-- SEO settings (single row)
create table seo_settings (
  id integer primary key default 1 check (id = 1),
  global_title text not null default '',
  global_description text not null default '',
  og_image_url text not null default '',
  twitter_card text not null default 'summary_large_image',
  robots_txt text not null default '',
  canonical_base text not null default ''
);

-- Analytics settings (single row)
create table analytics_settings (
  id integer primary key default 1 check (id = 1),
  ga_id text not null default '',
  search_console_id text not null default '',
  clarity_id text not null default '',
  meta_pixel_id text not null default ''
);

-- Media library
create table media (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  filename text not null,
  mime_type text not null default '',
  size_bytes bigint not null default 0,
  folder text not null default 'uploads',
  uploaded_by uuid references admin_users(id),
  created_at timestamptz not null default now()
);

-- Activity log
create table activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references admin_users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Founders
create table founders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  bio text not null default '',
  initials text not null default '',
  image_url text not null default '',
  sort_order integer not null default 0
);

-- Values
create table brand_values (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  text text not null default '',
  icon text not null default '',
  sort_order integer not null default 0
);

-- Timeline
create table timeline (
  id uuid primary key default gen_random_uuid(),
  year text not null,
  title text not null,
  text text not null default '',
  sort_order integer not null default 0
);

-- FAQ entries
create table faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null default '',
  sort_order integer not null default 0
);

-- ============================================================
-- INDEXES
-- ============================================================

create index idx_courses_slug on courses(slug);
create index idx_courses_status on courses(status);
create index idx_products_slug on products(slug);
create index idx_products_status on products(status);
create index idx_posts_slug on posts(slug);
create index idx_posts_status on posts(status);
create index idx_posts_featured on posts(featured) where status = 'published';
create index idx_resources_slug on resources(slug);
create index idx_testimonials_sort on testimonials(sort_order);
create index idx_nav_location on navigation_items(location, sort_order);
create index idx_media_folder on media(folder);
create index idx_media_uploader on media(uploaded_by);
create index idx_activity_user on activity_log(user_id);
create index idx_activity_entity on activity_log(entity_type, entity_id);
create index idx_activity_created on activity_log(created_at desc);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
alter table admin_users enable row level security;
alter table courses enable row level security;
alter table products enable row level security;
alter table posts enable row level security;
alter table mentorship_services enable row level security;
alter table resources enable row level security;
alter table testimonials enable row level security;
alter table homepage_settings enable row level security;
alter table navigation_items enable row level security;
alter table social_links enable row level security;
alter table site_settings enable row level security;
alter table seo_settings enable row level security;
alter table analytics_settings enable row level security;
alter table media enable row level security;
alter table activity_log enable row level security;
alter table founders enable row level security;
alter table brand_values enable row level security;
alter table timeline enable row level security;
alter table faqs enable row level security;

-- ---- Public read policies (anon key, published rows only) ----

-- Courses: anyone can read published courses
create policy "Courses published are public" on courses
  for select using (status = 'published');

-- Products: anyone can read published products
create policy "Products published are public" on products
  for select using (status = 'published');

-- Posts: anyone can read published posts
create policy "Posts published are public" on posts
  for select using (status = 'published');

-- Mentorship: public read (all entries, no draft/published distinction)
create policy "Mentorship services are public" on mentorship_services
  for select using (true);

-- Resources: public read
create policy "Resources are public" on resources
  for select using (true);

-- Testimonials: public read
create policy "Testimonials are public" on testimonials
  for select using (true);

-- Homepage settings: public read
create policy "Homepage settings are public" on homepage_settings
  for select using (true);

-- Navigation: public read
create policy "Navigation is public" on navigation_items
  for select using (true);

-- Social links: public read
create policy "Social links are public" on social_links
  for select using (true);

-- Site settings: public read
create policy "Site settings are public" on site_settings
  for select using (true);

-- SEO settings: public read
create policy "SEO settings are public" on seo_settings
  for select using (true);

-- Analytics settings: public read (IDs only, no secrets)
create policy "Analytics settings are public" on analytics_settings
  for select using (true);

-- Founders: public read
create policy "Founders are public" on founders
  for select using (true);

-- Brand values: public read
create policy "Brand values are public" on brand_values
  for select using (true);

-- Timeline: public read
create policy "Timeline is public" on timeline
  for select using (true);

-- FAQs: public read
create policy "FAQs are public" on faqs
  for select using (true);

-- ---- Admin write policies (authenticated admins only) ----

-- Helper function to check admin role
create or replace function is_admin(p_role admin_role default 'editor')
  returns boolean as $$
  select exists(
    select 1 from admin_users
    where id = auth.uid()
    and (
      p_role = 'editor' and role in ('founder', 'editor', 'content_manager')
      or p_role = 'founder' and role = 'founder'
    )
  );
  $$ language sql stable security definer;

-- Admin users: only founders can manage admins
create policy "Founders manage admins" on admin_users
  for all using (is_admin('founder'));

-- Content tables: editors and above can CRUD
create policy "Admins manage courses" on courses
  for all using (is_admin('editor'));

create policy "Admins manage products" on products
  for all using (is_admin('editor'));

create policy "Admins manage posts" on posts
  for all using (is_admin('editor'));

create policy "Admins manage mentorship" on mentorship_services
  for all using (is_admin('editor'));

create policy "Admins manage resources" on resources
  for all using (is_admin('editor'));

create policy "Admins manage testimonials" on testimonials
  for all using (is_admin('editor'));

create policy "Admins manage homepage" on homepage_settings
  for all using (is_admin('editor'));

create policy "Admins manage navigation" on navigation_items
  for all using (is_admin('editor'));

-- Single-row settings: editors and above
create policy "Admins manage social" on social_links
  for all using (is_admin('editor'));

create policy "Admins manage site settings" on site_settings
  for all using (is_admin('editor'));

create policy "Admins manage SEO" on seo_settings
  for all using (is_admin('editor'));

create policy "Admins manage analytics" on analytics_settings
  for all using (is_admin('editor'));

create policy "Admins manage media" on media
  for all using (is_admin('editor'));

create policy "Admins manage activity" on activity_log
  for all using (is_admin('editor'));

create policy "Admins manage founders" on founders
  for all using (is_admin('editor'));

create policy "Admins manage values" on brand_values
  for all using (is_admin('editor'));

create policy "Admins manage timeline" on timeline
  for all using (is_admin('editor'));

create policy "Admins manage faqs" on faqs
  for all using (is_admin('editor'));

-- ---- Admin read: admins can read all rows (including drafts) ----

create policy "Admins read all courses" on courses
  for select using (is_admin('editor'));

create policy "Admins read all products" on products
  for select using (is_admin('editor'));

create policy "Admins read all posts" on posts
  for select using (is_admin('editor'));

-- ============================================================
-- STORAGE BUCKET
-- ============================================================

-- Create a public media bucket for file uploads
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Storage policies: public read, admin write
create policy "Media bucket public read" on storage.objects
  for select using (bucket_id = 'media');

create policy "Media bucket admin upload" on storage.objects
  for insert with check (
    bucket_id = 'media' and is_admin('editor')
  );

create policy "Media bucket admin update" on storage.objects
  for update using (
    bucket_id = 'media' and is_admin('editor')
  );

create policy "Media bucket admin delete" on storage.objects
  for delete using (
    bucket_id = 'media' and is_admin('editor')
  );

-- ============================================================
-- TRIGGER: auto-update updated_at
-- ============================================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_courses_updated
  before update on courses
  for each row execute function update_updated_at();

create trigger trg_products_updated
  before update on products
  for each row execute function update_updated_at();

create trigger trg_mentorship_updated
  before update on mentorship_services
  for each row execute function update_updated_at();
