import { getSupabaseAdminClient } from '#/integrations/supabase/admin.ts'
import { ROLES } from '#/lib/auth/permissions.ts'
import { mapAuthAdminError, mapPostgrestError } from '#/lib/api/server-errors.ts'
import { AppError } from '#/lib/errors/app-error.ts'
import {
  cambiarContrasenaInputSchema,
  createUsuarioInputSchema,
  estatusUsuarioEnum,
  roleEnum,
  usuarioInputSchema,
  usuarioSchema,
} from '../schemas.ts'
import type {
  CambiarContrasenaInput,
  CreateUsuarioInput,
  EstatusUsuario,
  Usuario,
  UsuarioInput,
} from '../schemas.ts'

const FEATURE = 'usuarios'

type ProfileRow = {
  id: string
  nombre: string
  rol: Usuario['rol']
  estatus: EstatusUsuario
  created_at: string
  updated_at: string
}

function mapProfileToUsuario(
  profile: ProfileRow,
  email: string,
  lastLoginAt?: string | null,
): Usuario {
  return usuarioSchema.parse({
    id: profile.id,
    email,
    nombre: profile.nombre,
    rol: profile.rol,
    estatus: profile.estatus,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
    lastLoginAt: lastLoginAt ?? undefined,
  })
}

function toProfileRow(
  row: {
    id: string
    nombre: string
    rol: string
    estatus: string
    created_at: string
    updated_at: string
  },
  estatus: EstatusUsuario,
): ProfileRow {
  return {
    id: row.id,
    nombre: row.nombre,
    rol: roleEnum.parse(row.rol),
    estatus,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

function deriveEstatus(
  profileEstatus: EstatusUsuario,
  emailConfirmedAt?: string | null,
): EstatusUsuario {
  if (profileEstatus === 'pendiente') return 'pendiente'
  if (!emailConfirmedAt) return 'pendiente'
  return profileEstatus
}

async function assertNotLastAdminSupabase(id: string) {
  const admin = getSupabaseAdminClient()
  const { data: profile, error } = await admin
    .from('profiles')
    .select('rol, estatus')
    .eq('id', id)
    .single()

  if (error) throw mapPostgrestError(error, FEATURE)
  if (profile.rol !== ROLES.ADMIN) return

  const { count, error: countError } = await admin
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('rol', ROLES.ADMIN)
    .eq('estatus', 'activo')

  if (countError) throw mapPostgrestError(countError, FEATURE)
  if ((count ?? 0) <= 1) {
    throw new AppError(
      'VALIDATION_ERROR',
      'No se puede eliminar o desactivar al único administrador activo.',
      FEATURE,
    )
  }
}

export async function listUsuariosSupabase(): Promise<Usuario[]> {
  const admin = getSupabaseAdminClient()

  const { data: profiles, error: profilesError } = await admin
    .from('profiles')
    .select('id, nombre, rol, estatus, created_at, updated_at')
    .order('created_at', { ascending: false })

  if (profilesError) throw mapPostgrestError(profilesError, FEATURE)

  const { data: listData, error: listError } =
    await admin.auth.admin.listUsers({ perPage: 1000 })
  if (listError) throw mapAuthAdminError(listError, FEATURE)

  const authById = new Map(
    listData.users.map((u) => [
      u.id,
      {
        email: u.email ?? '',
        lastLoginAt: u.last_sign_in_at,
        emailConfirmedAt: u.email_confirmed_at,
      },
    ]),
  )

  return profiles.map((row) => {
    const auth = authById.get(row.id)
    const estatus = deriveEstatus(
      estatusUsuarioEnum.parse(row.estatus),
      auth?.emailConfirmedAt,
    )
    return mapProfileToUsuario(
      toProfileRow(row, estatus),
      auth?.email ?? '',
      auth?.lastLoginAt,
    )
  })
}

export async function getUsuarioSupabase(id: string): Promise<Usuario> {
  const admin = getSupabaseAdminClient()

  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select('id, nombre, rol, estatus, created_at, updated_at')
    .eq('id', id)
    .single()

  if (profileError) throw mapPostgrestError(profileError, FEATURE)

  const { data: authData, error: authError } =
    await admin.auth.admin.getUserById(id)
  if (authError) throw mapAuthAdminError(authError, FEATURE)

  const estatus = deriveEstatus(
    estatusUsuarioEnum.parse(profile.estatus),
    authData.user.email_confirmed_at,
  )

  return mapProfileToUsuario(
    toProfileRow(profile, estatus),
    authData.user.email ?? '',
    authData.user.last_sign_in_at,
  )
}

export async function createUsuarioSupabase(
  input: CreateUsuarioInput,
): Promise<Usuario> {
  const data = createUsuarioInputSchema.parse(input)
  const admin = getSupabaseAdminClient()

  const { data: created, error: createError } =
    await admin.auth.admin.createUser({
      email: data.email.toLowerCase(),
      password: data.password,
      email_confirm: true,
      user_metadata: { nombre: data.nombre },
    })

  if (createError) throw mapAuthAdminError(createError, FEATURE)

  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .update({
      nombre: data.nombre,
      rol: data.rol,
      estatus: data.estatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', created.user.id)
    .select('id, nombre, rol, estatus, created_at, updated_at')
    .single()

  if (profileError) throw mapPostgrestError(profileError, FEATURE)

  return mapProfileToUsuario(
    toProfileRow(profile, estatusUsuarioEnum.parse(profile.estatus)),
    created.user.email ?? data.email.toLowerCase(),
    created.user.last_sign_in_at,
  )
}

export async function updateUsuarioSupabase(
  id: string,
  input: UsuarioInput,
): Promise<Usuario> {
  const data = usuarioInputSchema.parse(input)
  const admin = getSupabaseAdminClient()

  const { data: current, error: currentError } = await admin
    .from('profiles')
    .select('rol, estatus')
    .eq('id', id)
    .single()

  if (currentError) throw mapPostgrestError(currentError, FEATURE)

  if (current.rol === ROLES.ADMIN && data.rol !== ROLES.ADMIN) {
    await assertNotLastAdminSupabase(id)
  }
  if (current.rol === ROLES.ADMIN && data.estatus !== 'activo') {
    await assertNotLastAdminSupabase(id)
  }

  const { data: authUser, error: authFetchError } =
    await admin.auth.admin.getUserById(id)
  if (authFetchError) throw mapAuthAdminError(authFetchError, FEATURE)

  if (
    authUser.user.email?.toLowerCase() !== data.email.toLowerCase()
  ) {
    const { error: emailError } = await admin.auth.admin.updateUserById(id, {
      email: data.email.toLowerCase(),
    })
    if (emailError) throw mapAuthAdminError(emailError, FEATURE)
  }

  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .update({
      nombre: data.nombre,
      rol: roleEnum.parse(data.rol),
      estatus: data.estatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('id, nombre, rol, estatus, created_at, updated_at')
    .single()

  if (profileError) throw mapPostgrestError(profileError, FEATURE)

  const { data: refreshedAuth, error: refreshError } =
    await admin.auth.admin.getUserById(id)
  if (refreshError) throw mapAuthAdminError(refreshError, FEATURE)

  return mapProfileToUsuario(
    toProfileRow(profile, data.estatus),
    refreshedAuth.user.email ?? data.email.toLowerCase(),
    refreshedAuth.user.last_sign_in_at,
  )
}

export async function deleteUsuarioSupabase(
  id: string,
  currentUserId?: string,
): Promise<void> {
  if (currentUserId && id === currentUserId) {
    throw new AppError(
      'VALIDATION_ERROR',
      'No puedes eliminar tu propia cuenta.',
      FEATURE,
    )
  }

  await assertNotLastAdminSupabase(id)

  const admin = getSupabaseAdminClient()
  const { error } = await admin.auth.admin.deleteUser(id)
  if (error) throw mapAuthAdminError(error, FEATURE)
}

export async function changeUsuarioPasswordSupabase(
  id: string,
  input: CambiarContrasenaInput,
): Promise<void> {
  const data = cambiarContrasenaInputSchema.parse(input)
  const admin = getSupabaseAdminClient()

  const { error } = await admin.auth.admin.updateUserById(id, {
    password: data.password,
  })
  if (error) throw mapAuthAdminError(error, FEATURE)
}
