-- FoodVerse database schema (milestone 2). Run in the Supabase SQL editor.
-- Draft: have a developer review the security policies before real customers use it.

create table public.worlds (
  id text primary key,                 -- 'pizza', 'burger', ...
  name text not null,
  emoji text not null,
  bg text not null,
  ink text not null,
  tagline text,
  sort int default 0
);

create table public.restaurants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,
  name text not null,
  tagline text,
  eta text,
  bg text not null default '#FFFFFF',
  accent text not null default '#6B2FE0',
  logo_url text,
  cover_url text,
  lat double precision,
  lng double precision,
  plan text not null default 'starter' check (plan in ('starter','pro','premium','enterprise')),
  spin_enabled boolean default false,
  stamps_enabled boolean default true,
  stamps_needed int default 6,
  is_live boolean default false,
  created_at timestamptz default now()
);

create table public.restaurant_worlds (
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  world_id text references public.worlds(id) on delete cascade,
  primary key (restaurant_id, world_id)
);

create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  description text,
  price int not null check (price >= 0),   -- in rupees
  category text not null,
  is_bestseller boolean default false,
  media_url text,
  model_url text,                          -- 3D model (.glb)
  is_available boolean default true,
  sort int default 0
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  phone text,
  xp int default 0,
  created_at timestamptz default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id),
  restaurant_id uuid not null references public.restaurants(id),
  mode text not null check (mode in ('delivery','pickup')),
  address text,
  status smallint not null default 0 check (status between 0 and 4), -- 0 placed, 1 preparing, 2 on the way/ready, 3 delivered/picked up, 4 cancelled
  subtotal int not null,
  delivery_fee int not null default 0,
  total int not null,
  payment_method text not null default 'cash',
  created_at timestamptz default now()
);

create table public.order_lines (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid references public.menu_items(id),
  name text not null,      -- copied at order time so history survives menu edits
  price int not null,
  qty int not null check (qty > 0)
);

create table public.stamps (
  customer_id uuid references auth.users(id) on delete cascade,
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  count int not null default 0,
  primary key (customer_id, restaurant_id)
);

-- Row level security: customers see their own data; owners see their restaurant's orders.
alter table public.restaurants enable row level security;
alter table public.restaurant_worlds enable row level security;
alter table public.menu_items enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_lines enable row level security;
alter table public.stamps enable row level security;
alter table public.worlds enable row level security;

create policy "worlds are public" on public.worlds for select using (true);
create policy "live restaurants are public" on public.restaurants for select using (is_live or owner_id = auth.uid());
create policy "owners edit their restaurant" on public.restaurants for update using (owner_id = auth.uid());
create policy "restaurant worlds are public" on public.restaurant_worlds for select using (true);
create policy "owners set their worlds" on public.restaurant_worlds for all
  using (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.owner_id = auth.uid()));
create policy "menus are public" on public.menu_items for select using (true);
create policy "owners edit their menu" on public.menu_items for all
  using (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.owner_id = auth.uid()));
create policy "own profile" on public.profiles for all using (id = auth.uid());
create policy "customers create own orders" on public.orders for insert with check (customer_id = auth.uid());
create policy "customers and owners read orders" on public.orders for select
  using (customer_id = auth.uid() or exists (select 1 from public.restaurants r where r.id = restaurant_id and r.owner_id = auth.uid()));
create policy "owners update order status" on public.orders for update
  using (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.owner_id = auth.uid()));
create policy "order lines follow their order" on public.order_lines for select
  using (exists (select 1 from public.orders o where o.id = order_id and (o.customer_id = auth.uid()
    or exists (select 1 from public.restaurants r where r.id = o.restaurant_id and r.owner_id = auth.uid()))));
create policy "customers add lines to own orders" on public.order_lines for insert
  with check (exists (select 1 from public.orders o where o.id = order_id and o.customer_id = auth.uid()));
create policy "own stamps" on public.stamps for select using (customer_id = auth.uid());

-- Live order updates for the customer app and restaurant dashboard.
alter publication supabase_realtime add table public.orders;
