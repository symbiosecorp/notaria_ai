import { queryOptions } from '@tanstack/react-query'
import { getSessionUserFn } from './api.ts'

export const sessionKeys = {
  session: ['auth', 'session'] as const,
}

/**
 * Sesión actual cacheada. El root route la asegura en beforeLoad y la expone
 * en el router context; useAuth la lee del mismo caché en los componentes.
 */
export function sessionQueryOptions() {
  return queryOptions({
    queryKey: sessionKeys.session,
    queryFn: () => getSessionUserFn(),
    staleTime: 60_000,
  })
}
