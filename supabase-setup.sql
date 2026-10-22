-- Jalankan seluruh SQL ini di Supabase > SQL Editor > New query.
-- Setelah itu buat akun admin lewat Authentication > Users > Add user.
-- Salin UUID akun admin, lalu jalankan INSERT di bagian paling bawah.

create extension if not exists pgcrypto;

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  date date default current_date,
  label text,
  thumbnail_url text,
  video_url text,
  tone1 text default '#394e69',
  tone2 text default '#151a2b',
  created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.videos enable row level security;
alter table public.admin_users enable row level security;

-- Anyone can read the public video catalogue.
drop policy if exists "Public can read videos" on public.videos;
create policy "Public can read videos"
on public.videos for select
to anon, authenticated
using (true);

-- Only UUIDs listed in admin_users can write video records.
drop policy if exists "Admins can insert videos" on public.videos;
create policy "Admins can insert videos"
on public.videos for insert
to authenticated
with check (exists (
  select 1 from public.admin_users au where au.user_id = (select auth.uid())
));

drop policy if exists "Admins can update videos" on public.videos;
create policy "Admins can update videos"
on public.videos for update
to authenticated
using (exists (
  select 1 from public.admin_users au where au.user_id = (select auth.uid())
))
with check (exists (
  select 1 from public.admin_users au where au.user_id = (select auth.uid())
));

drop policy if exists "Admins can delete videos" on public.videos;
create policy "Admins can delete videos"
on public.videos for delete
to authenticated
using (exists (
  select 1 from public.admin_users au where au.user_id = (select auth.uid())
));

-- Authenticated users may check only their own admin status.
drop policy if exists "Admins can read own admin record" on public.admin_users;
create policy "Admins can read own admin record"
on public.admin_users for select
to authenticated
using (user_id = (select auth.uid()));

grant select on public.videos to anon, authenticated;
grant insert, update, delete on public.videos to authenticated;
grant select on public.admin_users to authenticated;

-- AFTER creating the admin user in Authentication > Users, replace UUID below:
-- insert into public.admin_users (user_id) values ('PASTE-ADMIN-USER-UUID-HERE');
