-- Enable UUID extension (still useful for future)
create extension if not exists "uuid-ossp";

-- Movies Table
create table if not exists public.movies (
  id text primary key, -- Changed to text to match mock data IDs like "1", "2"
  title text not null,
  year integer not null,
  poster text,
  backdrop text,
  rating numeric(3, 1) default 0,
  rating_count integer default 0,
  runtime integer,
  genres text[],
  director text,
  "cast" text[],
  plot text,
  release_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Profiles Table (for Users)
create table if not exists public.profiles (
  id text primary key, -- Changed to text to support "u1" and UUIDs
  name text,
  email text,
  avatar text,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reviews Table
create table if not exists public.reviews (
  id text primary key default uuid_generate_v4()::text,
  movie_id text references public.movies(id) on delete cascade not null,
  user_id text references public.profiles(id) on delete cascade not null,
  user_name text,
  rating integer check (rating >= 0 and rating <= 10),
  title text,
  content text,
  helpful integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Watchlist Table
create table if not exists public.watchlist (
  user_id text references public.profiles(id) on delete cascade not null,
  movie_id text references public.movies(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, movie_id)
);

-- Favorites Table
create table if not exists public.favorites (
  user_id text references public.profiles(id) on delete cascade not null,
  movie_id text references public.movies(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, movie_id)
);

-- Row Level Security (RLS)
alter table public.movies enable row level security;
alter table public.profiles enable row level security;
alter table public.reviews enable row level security;
alter table public.watchlist enable row level security;
alter table public.favorites enable row level security;

-- Policies (Public Read, Authenticated Write)
-- Policies (Public Read, Authenticated Write)
drop policy if exists "Public movies are viewable by everyone" on public.movies;
create policy "Public movies are viewable by everyone" on public.movies for select using (true);

drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);

drop policy if exists "Reviews are viewable by everyone" on public.reviews;
create policy "Reviews are viewable by everyone" on public.reviews for select using (true);

-- Authenticated users policies
drop policy if exists "Users can insert reviews" on public.reviews;
create policy "Users can insert reviews" on public.reviews for insert with check (auth.uid()::text = user_id);

drop policy if exists "Users can update own reviews" on public.reviews;
create policy "Users can update own reviews" on public.reviews for update using (auth.uid()::text = user_id);

drop policy if exists "Users can delete own reviews" on public.reviews;
create policy "Users can delete own reviews" on public.reviews for delete using (auth.uid()::text = user_id);

drop policy if exists "Users can view own watchlist" on public.watchlist;
create policy "Users can view own watchlist" on public.watchlist for select using (auth.uid()::text = user_id);

drop policy if exists "Users can modify own watchlist" on public.watchlist;
create policy "Users can modify own watchlist" on public.watchlist for all using (auth.uid()::text = user_id);

drop policy if exists "Users can view own favorites" on public.favorites;
create policy "Users can view own favorites" on public.favorites for select using (auth.uid()::text = user_id);

drop policy if exists "Users can modify own favorites" on public.favorites;
create policy "Users can modify own favorites" on public.favorites for all using (auth.uid()::text = user_id);

-- Insert dummy profile for seed data if needed (optional)
