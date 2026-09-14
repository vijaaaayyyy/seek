-- Saved verses, owned by the signed-in user (user_id = Better Auth user id).
create table if not exists saved_verses (
  user_id  text not null,
  slug     text not null,
  book     text not null,
  chapter  integer not null,
  verse    integer not null,
  text     text not null,
  saved_at timestamptz not null default now(),
  primary key (user_id, slug, chapter, verse)
);

create index if not exists saved_verses_user_idx on saved_verses (user_id, saved_at desc);