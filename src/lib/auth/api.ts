import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getSupabaseServerClient } from '#/integrations/supabase/server.ts'
import { createLogger } from '#/lib/errors/logger.ts'
import { ROLES } from './permissions.ts'
import { loginInputSchema } from './schemas.ts'
import type { AuthError } from '@supabase/supabase-js'
import type { User } from './types.ts'

const logger = createLogger('auth')

const profileRowSchema = z.object({
  nombre: z.string(),
  rol: z.enum(ROLES),
})

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

/**
 * Usuario de la sesión actual o null. Usa getUser() (validación real contra el
 * servidor de auth, no la cookie sin verificar) y completa nombre/rol desde
 * profiles. Si el perfil aún no existe, degrada a rol 'invitado' (sin acceso).
 */
export const getSessionUserFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<User | null> => {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.auth.getUser()
    if (error) return null

    const { data: profileRow, error: profileError } = await supabase
      .from('profiles')
      .select('nombre, rol')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      logger.error('No se pudo leer el perfil del usuario', profileError, {
        userId: data.user.id,
      })
    }

    const profile = profileRowSchema.safeParse(profileRow)
    const email = data.user.email ?? ''

    return {
      id: data.user.id,
      email,
      name: profile.success && profile.data.nombre ? profile.data.nombre : email,
      role: profile.success ? profile.data.rol : ROLES.INVITADO,
    }
  },
)
