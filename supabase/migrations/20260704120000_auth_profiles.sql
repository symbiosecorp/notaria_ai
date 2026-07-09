-- Fase auth: enum de roles, tabla profiles, RLS y alta automática de perfil.
-- Los valores del enum reflejan ROLES de src/lib/auth/permissions.ts.

create type public.user_role as enum (
  'admin',
  'notario',
  'abogado',
  'asistente',
  'contador',
  'invitado'
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null default '',
  rol public.user_role not null default 'invitado',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Perfil de aplicación por usuario de auth: nombre visible y rol (RBAC).';

alter table public.profiles enable row level security;

-- Cada usuario lee únicamente su propio perfil. La escritura queda reservada
-- al service role / dashboard hasta que exista el módulo de administración.
create policy "usuarios leen su propio perfil"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

-- Alta automática de perfil al crear un usuario en auth.users.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nombre, rol)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nombre', ''),
    'invitado'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();

-- Backfill: los usuarios existentes (hoy: uno, el administrador) reciben rol admin.
insert into public.profiles (id, nombre, rol)
select id, coalesce(raw_user_meta_data ->> 'nombre', ''), 'admin'
from auth.users
on conflict (id) do nothing;
