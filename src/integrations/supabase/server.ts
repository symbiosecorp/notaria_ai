import { createServerClient } from '@supabase/ssr'
import { getCookies, setCookie } from '@tanstack/react-start/server'
import { AppError } from '#/lib/errors/app-error'

/**
 * Cliente de Supabase para server functions. La sesión viaja en cookies, por lo
 * que la autenticación es verificable tanto en SSR como en el cliente.
 */
export function getSupabaseServerClient() {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

  if (!url || !key) {
    throw new AppError(
      'SERVICE_ERROR',
      'Faltan VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY (ver .env.example).',
      'auth',
    )
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return Object.entries(getCookies()).map(([name, value]) => ({
          name,
          value,
        }))
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          setCookie(name, value, options)
        }
      },
    },
  })
}
