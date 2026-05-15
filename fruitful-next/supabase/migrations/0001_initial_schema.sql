-- Fruitful — Initial schema for fruit purchasing & warehouse management
-- Run this in Supabase SQL Editor (Project > SQL > New query)

-- ============ Profiles (extends auth.users) ============
create type user_role as enum ('warehouse_manager', 'accountant', 'viewer');

create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  role        user_role not null default 'warehouse_manager',
  created_at  timestamptz not null default now()
);

-- Auto-create a profile when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), 'warehouse_manager');
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ Fruits ============
create table public.fruits (
  id     text primary key,             -- F01, F02 ...
  name   text not null,                 -- Thai name
  en     text not null,                 -- English name
  color  text not null,                 -- hex
  code   text not null                  -- short code (MG, DR, ...)
);

-- ============ Suppliers ============
create table public.suppliers (
  id           text primary key,        -- S0142
  name         text not null,
  owner        text,
  province     text,
  phone        text,
  bank         text,
  credit       text default 'A',        -- A / B / C
  total        bigint not null default 0,
  outstanding  bigint not null default 0,
  orders       int not null default 0,
  fruits       text[] not null default '{}',
  created_at   timestamptz not null default now()
);

-- ============ Zones (warehouse capacity) ============
create table public.zones (
  id        text primary key,           -- A-01, B-04 ...
  fruit_id  text references public.fruits(id),
  kg        int not null default 0,
  cap       int not null,
  type      text not null check (type in ('cool','warm','full','empty')),
  temp      int
);

-- ============ Purchase orders (transactions) ============
create type pay_status as enum ('paid', 'pending', 'partial');

create table public.purchases (
  id           text primary key,        -- PO-26052-0184
  date         date not null,
  supplier_id  text not null references public.suppliers(id),
  fruit_id     text not null references public.fruits(id),
  kg           int not null,
  price        int not null,            -- baht per kg
  total        bigint not null,
  grade        text not null check (grade in ('A','B','C','D')),
  pay          pay_status not null default 'pending',
  warehouse    text,
  zone         text references public.zones(id),
  created_at   timestamptz not null default now(),
  created_by   uuid references public.profiles(id)
);

create index purchases_date_idx on public.purchases(date desc);
create index purchases_supplier_idx on public.purchases(supplier_id);

-- ============ Payments ============
create type payment_method as enum ('cash', 'transfer', 'qr');
create type payment_status as enum ('pending', 'approval', 'scheduled', 'paid');

create table public.payments (
  id           text primary key,        -- PY-2026-0421
  supplier_id  text not null references public.suppliers(id),
  amount       bigint not null,
  due          date not null,
  method       payment_method not null,
  status       payment_status not null default 'pending',
  po           text,                    -- PO id or label like "3 รายการ"
  created_at   timestamptz not null default now()
);

-- ============ RLS Policies ============
alter table public.profiles  enable row level security;
alter table public.fruits    enable row level security;
alter table public.suppliers enable row level security;
alter table public.zones     enable row level security;
alter table public.purchases enable row level security;
alter table public.payments  enable row level security;

-- All authenticated users (warehouse_manager+) can read everything
create policy "auth read profiles"   on public.profiles  for select to authenticated using (true);
create policy "auth read fruits"     on public.fruits    for select to authenticated using (true);
create policy "auth read suppliers"  on public.suppliers for select to authenticated using (true);
create policy "auth read zones"      on public.zones     for select to authenticated using (true);
create policy "auth read purchases"  on public.purchases for select to authenticated using (true);
create policy "auth read payments"   on public.payments  for select to authenticated using (true);

-- Warehouse manager can write
create policy "mgr write suppliers" on public.suppliers for all to authenticated
  using ( exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'warehouse_manager') )
  with check ( true );

create policy "mgr write zones" on public.zones for all to authenticated
  using ( exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'warehouse_manager') )
  with check ( true );

create policy "mgr write purchases" on public.purchases for all to authenticated
  using ( exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'warehouse_manager') )
  with check ( true );

create policy "mgr write payments" on public.payments for all to authenticated
  using ( exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'warehouse_manager') )
  with check ( true );

-- Users can update their own profile
create policy "self update profile" on public.profiles for update to authenticated
  using ( id = auth.uid() ) with check ( id = auth.uid() );
