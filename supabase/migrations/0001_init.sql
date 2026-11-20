-- Supabase schema for NÓRDICO store (demo)
create table if not exists products (
  id bigint primary key,
  name text not null,
  price numeric not null,
  category text not null,
  stock int not null default 0,
  description text,
  image text,
  badge text,
  created_at timestamptz default now()
);

create table if not exists orders (
  id text primary key,
  customer_email text not null,
  customer_name text,
  date timestamptz not null,
  subtotal numeric not null,
  tax numeric not null,
  total numeric not null,
  address text,
  payment text
);

create table if not exists order_items (
  id bigserial primary key,
  order_id text references orders(id) on delete cascade,
  product_id bigint,
  name text not null,
  price numeric not null,
  quantity int not null
);

create table if not exists favorites (
  user_email text not null,
  product_id bigint not null,
  created_at timestamptz default now(),
  primary key (user_email, product_id)
);

create table if not exists settings (
  key text primary key,
  value jsonb not null
);

create table if not exists policies (
  key text primary key,
  title text not null,
  content text not null
);

-- Permissive RLS for demo (replace with proper policies in production)
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table favorites enable row level security;
alter table settings enable row level security;
alter table policies enable row level security;

create policy "products public read" on products for select using (true);
create policy "products public write" on products for all using (true) with check (true);
create policy "orders public all" on orders for all using (true) with check (true);
create policy "order_items public all" on order_items for all using (true) with check (true);
create policy "favorites public all" on favorites for all using (true) with check (true);
create policy "settings public all" on settings for all using (true) with check (true);
create policy "policies public all" on policies for all using (true) with check (true);