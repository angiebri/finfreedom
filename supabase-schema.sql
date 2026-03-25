-- Run this in Supabase SQL Editor (Database → SQL Editor → New query)

-- Finance state (one row per user)
create table if not exists public.finance_state (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  data jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- Finance history (append-only log)
create table if not exists public.finance_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now(),
  active_income numeric default 0,
  passive_income numeric default 0,
  total_income numeric default 0,
  total_expenses numeric default 0,
  delta numeric default 0,
  total_capital numeric default 0,
  cushion_total numeric default 0,
  snapshot jsonb default '{}'
);

-- Indexes
create index if not exists finance_history_user_id_idx on public.finance_history(user_id);
create index if not exists finance_history_created_at_idx on public.finance_history(created_at desc);

-- Row Level Security
alter table public.finance_state enable row level security;
alter table public.finance_history enable row level security;

-- Policies: users can only access their own data
create policy "Users can manage their own state"
  on public.finance_state for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage their own history"
  on public.finance_history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
