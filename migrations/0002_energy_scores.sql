create table if not exists energy_scores (
  id serial primary key,
  handle text not null,
  score integer not null,
  cities integer not null,
  duration_ms integer not null,
  badge text not null,
  challenge_id text not null,
  created_at timestamptz not null default now()
);

create index if not exists energy_scores_weekly_idx
  on energy_scores (score desc, created_at desc);

create table if not exists energy_plays (
  id serial primary key,
  source text not null default 'direct',
  completed boolean not null default false,
  cities integer not null default 0,
  created_at timestamptz not null default now()
);
