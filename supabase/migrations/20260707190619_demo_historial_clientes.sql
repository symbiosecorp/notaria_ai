-- Demo: historial de clientes + importación documental
-- Fase demo sin Supabase Auth: políticas permisivas. Endurecer con auth.uid() en Fase 2.

create extension if not exists "pgcrypto";

-- ── Clientes ────────────────────────────────────────────────────────────────

create table if not exists public.clientes (
  id uuid primary key default gen_random_uuid(),
  tipo_persona text not null check (tipo_persona in ('fisica', 'moral')),
  nombre text not null,
  rfc text not null default '',
  email text not null default '',
  telefono text not null default '',
  domicilio text not null default '',
  estatus text not null default 'activo'
    check (estatus in ('prospecto', 'activo', 'inactivo')),
  curp text not null default '',
  nacionalidad text not null default '',
  estado_civil text check (
    estado_civil is null
    or estado_civil in ('soltero', 'casado', 'divorciado', 'viudo', 'union_libre')
  ),
  representante_legal text not null default '',
  beneficiario_controlador text not null default '',
  es_actividad_vulnerable boolean not null default false,
  notas text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clientes_rfc_idx on public.clientes (rfc)
  where rfc <> '';

-- ── Expedientes ─────────────────────────────────────────────────────────────

create table if not exists public.expedientes (
  id uuid primary key default gen_random_uuid(),
  folio text not null unique,
  tipo_acto text not null,
  descripcion text not null default '',
  cliente_id uuid not null references public.clientes (id) on delete cascade,
  cliente_nombre text not null,
  responsable text not null,
  estatus text not null default 'abierto',
  fecha_apertura timestamptz not null default now(),
  fecha_limite timestamptz,
  documentos_pendientes text[] not null default '{}',
  valor_operacion numeric(14, 2),
  notas text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists expedientes_cliente_id_idx on public.expedientes (cliente_id);
create index if not exists expedientes_tipo_acto_idx on public.expedientes (tipo_acto);

-- ── Documentos importados (historial) ───────────────────────────────────────

create table if not exists public.documentos_historial (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references public.clientes (id) on delete set null,
  expediente_id uuid references public.expedientes (id) on delete set null,
  storage_path text not null,
  file_name text not null,
  mime_type text not null default 'application/octet-stream',
  file_size bigint not null default 0,
  tipo_acto_detectado text,
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'procesando', 'procesado', 'error')),
  error_mensaje text,
  created_at timestamptz not null default now()
);

create index if not exists documentos_historial_cliente_id_idx
  on public.documentos_historial (cliente_id);

-- ── Storage: bucket de historial ────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'historial-clientes',
  'historial-clientes',
  false,
  52428800,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
on conflict (id) do nothing;

-- ── RLS ─────────────────────────────────────────────────────────────────────

alter table public.clientes enable row level security;
alter table public.expedientes enable row level security;
alter table public.documentos_historial enable row level security;

-- Demo: acceso staff vía anon key hasta integrar Supabase Auth
create policy "demo_clientes_all"
  on public.clientes
  for all
  to anon, authenticated
  using (true)
  with check (true);

create policy "demo_expedientes_all"
  on public.expedientes
  for all
  to anon, authenticated
  using (true)
  with check (true);

create policy "demo_documentos_historial_all"
  on public.documentos_historial
  for all
  to anon, authenticated
  using (true)
  with check (true);

create policy "demo_historial_storage_select"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'historial-clientes');

create policy "demo_historial_storage_insert"
  on storage.objects
  for insert
  to anon, authenticated
  with check (bucket_id = 'historial-clientes');

create policy "demo_historial_storage_update"
  on storage.objects
  for update
  to anon, authenticated
  using (bucket_id = 'historial-clientes')
  with check (bucket_id = 'historial-clientes');

create policy "demo_historial_storage_delete"
  on storage.objects
  for delete
  to anon, authenticated
  using (bucket_id = 'historial-clientes');

-- Grants explícitos para Data API
grant select, insert, update, delete on public.clientes to anon, authenticated;
grant select, insert, update, delete on public.expedientes to anon, authenticated;
grant select, insert, update, delete on public.documentos_historial to anon, authenticated;
