-- Extiende profiles para administración de usuarios (estatus de cuenta).
-- Valores alineados con src/features/usuarios/schemas.ts (estatusUsuarioEnum).

create type public.profile_status as enum ('activo', 'inactivo', 'pendiente');

alter table public.profiles
  add column if not exists estatus public.profile_status not null default 'activo';

comment on column public.profiles.estatus is
  'Estatus operativo de la cuenta (activo, inactivo, pendiente de activación).';

-- Admins autenticados pueden listar perfiles (lectura para el módulo de usuarios).
-- Las mutaciones privilegiadas siguen vía service_role en server functions.
create policy "admins leen todos los perfiles"
  on public.profiles
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles admin_profile
      where admin_profile.id = (select auth.uid())
        and admin_profile.rol = 'admin'
    )
  );
