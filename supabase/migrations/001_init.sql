-- profiles table
create table if not exists profiles (
  id uuid primary key references auth.users(id),
  role text not null,
  name text
);

-- editors table
create table if not exists editors (
  id uuid primary key references profiles(id),
  business_email text,
  editing_experience text,
  content_types text[],
  portfolio_links text[],
  test_submission_url text,
  challenge_completed boolean default false,
  score int
);

-- RLS enable
alter table profiles enable row level security;
alter table editors enable row level security;

-- policies profiles
create policy "select any" on profiles for select using (true);
create policy "insert self" on profiles for insert with check (auth.uid() = id);
create policy "update self" on profiles for update using (auth.uid() = id);

-- policies editors
create policy "select public" on editors for select using (auth.role() = 'hirer' or auth.uid() = id);
create policy "insert self" on editors for insert with check (auth.uid() = id);
create policy "update self" on editors for update using (auth.uid() = id);
