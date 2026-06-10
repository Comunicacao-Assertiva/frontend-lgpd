-- ============================================================
-- Matriz 4Q-LGPD — Schema Supabase
-- Execute no SQL Editor do Supabase
-- ============================================================

create table if not exists public.diagnosticos (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  organization  text not null default '',
  total_score   integer not null,
  percentage    integer not null,
  quadrant_id   integer not null,
  quadrant_name text not null,
  quadrant_color text not null,
  gov_percentage integer not null,
  sec_percentage integer not null,
  pillar_scores jsonb not null default '[]',
  answers       jsonb not null default '{}'
);

-- Índices
create index if not exists diagnosticos_created_at_idx
  on public.diagnosticos (created_at desc);

create index if not exists diagnosticos_organization_idx
  on public.diagnosticos (organization);

-- RLS (Row Level Security)
alter table public.diagnosticos enable row level security;

-- Política pública de leitura/escrita (ajuste conforme autenticação)
-- Para MVP sem auth: permite tudo
create policy "allow_all" on public.diagnosticos
  for all using (true) with check (true);

-- Comentários
comment on table public.diagnosticos is 'Diagnósticos 4Q-LGPD salvos';
comment on column public.diagnosticos.answers is 'Respostas no formato { p1q0: 2, p1q1: 1, ... }';
comment on column public.diagnosticos.pillar_scores is 'Pontuação por pilar [{ id, name, score, maxScore, percentage }]';
