-- ==========================================
-- Professional Movie Rating App Schema (v2)
-- Normalized, Scalable, and Secure
-- ==========================================

-- 1. Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- For text search

-- ==========================================
-- 2. User & Profile Management
-- ==========================================

-- Profiles: Public user data
-- Links 1:1 with auth.users
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  website text,
  location text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone
);

-- Follows: User-to-User relationships
create table public.follows (
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (follower_id, following_id),
  check (follower_id != following_id)
);

-- ==========================================
-- 3. Movie Metadata (Normalized)
-- ==========================================

-- Movies: Core movie data
create table public.movies (
  id uuid default uuid_generate_v4() primary key,
  tmdb_id integer unique, -- External ID reference
  imdb_id text unique,
  js_id text unique, -- For compatibility with existing mock data ("1", "2", etc.)
  title text not null,
  original_title text,
  overview text,
  release_date date,
  runtime integer, -- minutes
  poster_path text,
  backdrop_path text,
  status text, -- 'Released', 'Upcoming', etc.
  tagline text,
  budget bigint,
  revenue bigint,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Genres: Normalized genre list
create table public.genres (
  id integer primary key,
  name text not null
);

-- Movie_Genres: Join table
create table public.movie_genres (
  movie_id uuid references public.movies(id) on delete cascade not null,
  genre_id integer references public.genres(id) on delete cascade not null,
  primary key (movie_id, genre_id)
);

-- People: Cast and Crew members
create table public.people (
  id integer primary key, -- TMDB Person ID
  name text not null,
  profile_path text
);

-- Cast_Members: Linking people to movies as cast
create table public.cast_members (
  id uuid default uuid_generate_v4() primary key,
  movie_id uuid references public.movies(id) on delete cascade not null,
  person_id integer references public.people(id) on delete cascade not null,
  character_name text,
  "order" integer not null
);

-- Crew_Members: Linking people to movies as crew (Directors, etc.)
create table public.crew_members (
  id uuid default uuid_generate_v4() primary key,
  movie_id uuid references public.movies(id) on delete cascade not null,
  person_id integer references public.people(id) on delete cascade not null,
  job text not null, -- 'Director', 'Writer', etc.
  department text
);

-- ==========================================
-- 4. Social Interactions
-- ==========================================

-- Reviews: Text-based reviews
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  movie_id uuid references public.movies(id) on delete cascade not null,
  rating integer check (rating >= 1 and rating <= 10), -- Optional rating with review
  title text,
  content text not null,
  likes_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone,
  unique (user_id, movie_id) 
);

-- Ratings: Pure numerical ratings (if separated from reviews)
-- Note: We can merge this into reviews or keep separate. 
-- For a "perfect" system, often a rating IS a review without text, or vice-versa.
-- We'll rely on the 'reviews' table to hold ratings even if content is null for simplicity unless requested otherwise.

-- Watchlist: Movies to watch
create table public.watchlist (
  user_id uuid references public.profiles(id) on delete cascade not null,
  movie_id uuid references public.movies(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, movie_id)
);

-- Favorites: User favorites
create table public.favorites (
  user_id uuid references public.profiles(id) on delete cascade not null,
  movie_id uuid references public.movies(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, movie_id)
);

-- ==========================================
-- 5. RLS Policies
-- ==========================================

alter table public.profiles enable row level security;
alter table public.follows enable row level security;
alter table public.movies enable row level security;
alter table public.reviews enable row level security;
alter table public.watchlist enable row level security;
alter table public.favorites enable row level security;

-- Public Read Access
create policy "Public read access" on public.profiles for select using (true);
create policy "Public read access" on public.follows for select using (true);
create policy "Public read access" on public.movies for select using (true);
create policy "Public read access" on public.reviews for select using (true);

-- Auth User Access
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can follow others" on public.follows for insert with check (auth.uid() = follower_id);
create policy "Users can unfollow" on public.follows for delete using (auth.uid() = follower_id);

create policy "Users can create reviews" on public.reviews for insert with check (auth.uid() = user_id);
create policy "Users can update own reviews" on public.reviews for update using (auth.uid() = user_id);
create policy "Users can delete own reviews" on public.reviews for delete using (auth.uid() = user_id);

create policy "Users can manage watchlist" on public.watchlist for all using (auth.uid() = user_id);
create policy "Users can manage favorites" on public.favorites for all using (auth.uid() = user_id);

-- ==========================================
-- 6. Triggers & Functions
-- ==========================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'name', -- Fallback username/name
    new.raw_user_meta_data ->> 'full_name',
    'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update timestamps
create or replace function update_timestamp()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_profiles_timestamp before update on public.profiles for each row execute procedure update_timestamp();
create trigger update_reviews_timestamp before update on public.reviews for each row execute procedure update_timestamp();

-- ==========================================
-- 7. Storage
-- ==========================================

insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('posters', 'posters', true) on conflict (id) do nothing;

create policy "Public Access Avatars" on storage.objects for select using ( bucket_id = 'avatars' );
create policy "User Upload Avatar" on storage.objects for insert with check ( bucket_id = 'avatars' );
