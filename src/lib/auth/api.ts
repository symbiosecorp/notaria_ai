import { createServerFn } from '@tanstack/react-start'
import { resolveSessionUser } from '#/lib/auth/session-server.ts'
import { createLogger } from '#/lib/errors/logger.ts'
import { loginInputSchema } from './schemas.ts'
import type { AuthError } from '@supabase/supabase-js'
import type { User } from './types.ts'
import { getSupabaseServerClient } from '#/integrations/supabase/server.ts'

const logger = createLogger('auth')

export type LoginResult = { ok: true } | { ok: false; message: string }

function mapAuthError(error: AuthError): string {
  switch (error.code) {
    case 'invalid_credentials':
      return 'Correo o contraseña incorrectos.'
    case 'email_not_confirmed':
      return 'Tu correo aún no está confirmado. Revisa tu bandeja de entrada.'
    case 'over_request_rate_limit':
      return 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.'
    default:
      logger.error('Error de autenticación no mapeado', error, {
        code: error.code,
      })
      return 'No se pudo iniciar sesión. Inténtalo de nuevo.'
  }
}

export const loginFn = createServerFn({ method: 'POST' })
  .validator(loginInputSchema)
  .handler(async ({ data }): Promise<LoginResult> => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      return { ok: false, message: mapAuthError(error) }
    }
    return { ok: true }
  })

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    logger.warn('signOut devolvió error; la cookie local igual se limpia', {
      message: error.message,
    })
  }
})

export const getSessionUserFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<User | null> => resolveSessionUser(),
)
