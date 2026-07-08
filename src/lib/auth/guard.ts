import { redirect } from '@tanstack/react-router'
import { AppError } from '#/lib/errors/app-error.ts'
import { hasPermission } from './permissions.ts'
import type { Permission } from './permissions.ts'
import type { User } from './types.ts'

// La sesión vive en cookies, así que los guards corren igual en servidor y
// cliente: sin sesión, el redirect a /login sucede ya desde el SSR.
export function requireAuth(user: User | null | undefined): asserts user is User {
  if (!user) {
    throw redirect({ to: '/login' })
  }
}

export function requirePermission(
  user: User | null | undefined,
  permission: Permission,
): asserts user is User {
  requireAuth(user)
  if (!hasPermission(user.role, permission)) {
    throw new AppError(
      'AUTH_FORBIDDEN',
      'No tienes permiso para acceder a este módulo.',
      'auth',
    )
  }
}
