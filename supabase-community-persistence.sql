-- Run this once in Supabase SQL Editor to allow persisted community posts/comments.

alter table public.community_posts
  add column if not exists category text not null default '이용후기',
  add column if not exists author_name text,
  add column if not exists photo_url text,
  add column if not exists location_label text,
  add column if not exists location_lat double precision,
  add column if not exists location_lng double precision;

alter table public.comments
  alter column user_id drop not null,
  alter column post_id drop not null,
  add column if not exists post_key text,
  add column if not exists author_name text;

create index if not exists comments_post_key_idx on public.comments(post_key);

alter table public.community_posts enable row level security;
alter table public.comments enable row level security;

drop policy if exists "community posts are readable by authenticated users" on public.community_posts;
drop policy if exists "community posts are readable by everyone" on public.community_posts;
create policy "community posts are readable by everyone"
on public.community_posts for select
to anon, authenticated
using (true);

drop policy if exists "users can create their own community posts" on public.community_posts;
create policy "users can create their own community posts"
on public.community_posts for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "users can update their own community posts" on public.community_posts;
create policy "users can update their own community posts"
on public.community_posts for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "users can delete their own community posts" on public.community_posts;
create policy "users can delete their own community posts"
on public.community_posts for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "comments are readable by authenticated users" on public.comments;
drop policy if exists "comments are readable by everyone" on public.comments;
create policy "comments are readable by everyone"
on public.comments for select
to anon, authenticated
using (true);

drop policy if exists "anonymous users can create guest comments" on public.comments;
create policy "anonymous users can create guest comments"
on public.comments for insert
to anon
with check (user_id is null and author_name = '게스트');

drop policy if exists "users can create their own comments" on public.comments;
create policy "users can create their own comments"
on public.comments for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "users can update their own comments" on public.comments;
create policy "users can update their own comments"
on public.comments for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "users can delete their own comments" on public.comments;
create policy "users can delete their own comments"
on public.comments for delete
to authenticated
using ((select auth.uid()) = user_id);

grant select on public.community_posts to anon;
grant select, insert, update, delete on public.community_posts to authenticated;
grant select, insert on public.comments to anon;
grant select, insert, update, delete on public.comments to authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;
