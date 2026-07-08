import { getSupabaseServerClient } from '#/integrations/supabase/server.ts'
import { createLogger } from '#/lib/errors/logger.ts'
import { ROLES } from './permissions.ts'
import type { User } from './types.ts'
import { z } from 'zod'

const logger = createLogger('auth')

const profileRowSchema = z.object({
  nombre: z.string(),
  rol: z.enum([
    ROLES.ADMIN,
    ROLES.NOTARIO,
    ROLES.ABOGADO,
    ROLES.ASISTENTE,
    ROLES.CONTADOR,
    ROLES.INVITADO,
  ]),
})

/**
 * Resuelve el usuario de sesión en el servidor (cookies + getUser + profiles).
 * Compartido por getSessionUserFn y los guards de server functions.
 */
export async function resolveSessionUser(): Promise<User | null> {
  const supabase = getSupabaseServerClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user) return null

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
}
