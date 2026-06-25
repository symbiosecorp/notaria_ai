import { redirect } from '@tanstack/react-router'
import { AppError } from '#/lib/errors/app-error'
import { hasPermission } from './permissions'
import type { Permission } from './permissions'
import type { auth } from '#/stores/auth-store'

type AuthAccessor = typeof auth

// La sesión mock vive solo en el cliente, por lo que en SSR no es legible y el
// cliente es la autoridad. Con auth real (cookies) la verificación debería
// ejecutarse también en el servidor.
export function requireAuth(authCtx: AuthAccessor) {
  if (typeof window === 'undefined') return
  if (!authCtx.user) {
    throw redirect({ to: '/login' })
  }
}

export function requirePermission(authCtx: AuthAccessor, permission: Permission) {
  requireAuth(authCtx)
  if (typeof window === 'undefined') return
  const user = authCtx.user
  if (!user || !hasPermission(user.role, permission)) {
    throw new AppError(
      'AUTH_FORBIDDEN',
      'No tienes permiso para acceder a este módulo.',
      'auth',
    )
  }
}
