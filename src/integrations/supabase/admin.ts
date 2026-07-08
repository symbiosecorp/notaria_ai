import { createClient } from '@supabase/supabase-js'
import { AppError } from '#/lib/errors/app-error.ts'
import type { Database } from './database.types.ts'

/**
 * Cliente con service_role — solo en server functions. Bypass RLS para
 * operaciones administrativas (p. ej. gestión de usuarios). Nunca importar
 * desde componentes, hooks ni services del cliente.
 */
export function getSupabaseAdminClient() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new AppError(
      'SERVICE_ERROR',
      'Falta SUPABASE_SERVICE_ROLE_KEY en el entorno del servidor (ver .env.example).',
      'supabase',
    )
  }

  return createClient<Database>(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
