-- Second Brain notes app schema
-- run with: npm run db:init

create table if not exists users (
    id serial primary key,
    name varchar(100) not null,
    email varchar(255) not null unique,
    password text not null,
    created_at timestamptz not null default now()
);

create table if not exists notes (
    id serial primary key,
    user_id integer not null references users(id) on delete cascade,
    title varchar(255) not null,
    content text not null default '',
    link text,
    tags text[] not null default '{}',
    is_public boolean not null default false,
    share_id uuid not null unique default gen_random_uuid(),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists notes_user_id_idx on notes (user_id);
create index if not exists notes_tags_idx on notes using gin (tags);
