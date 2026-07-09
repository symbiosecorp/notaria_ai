import { resolveSessionUser } from '#/lib/auth/session-server.ts'
import { hasPermission } from '#/lib/auth/permissions.ts'
import { AppError } from '#/lib/errors/app-error.ts'
import type { Permission } from '#/lib/auth/permissions.ts'
import type { User } from '#/lib/auth/types.ts'

/** Sesión obligatoria dentro de una server function. */
export async function requireServerAuth(): Promise<User> {
  const user = await resolveSessionUser()
  if (!user) {
    throw new AppError(
      'AUTH_REQUIRED',
      'Debes iniciar sesión para realizar esta acción.',
      'auth',
    )
  }
  return user
}

/** Sesión + permiso RBAC dentro de una server function. */
export async function requireServerPermission(
  permission: Permission,
): Promise<User> {
  const user = await requireServerAuth()
  if (!hasPermission(user.role, permission)) {
    throw new AppError(
      'AUTH_FORBIDDEN',
      'No tienes permiso para realizar esta acción.',
      'auth',
    )
  }
  return user
}
