create table if not exists links (
  id serial primary key,
  long text not null,
  short text not null,
  status text not null,
  created_at timestamp default now(),
  title text not null,
  userId uuid references auth.users(id) on delete cascade
);