import { QueryClient } from '@tanstack/react-query'

// Se crea un QueryClient nuevo por request para evitar fuga de caché entre
// usuarios durante SSR. En el cliente se instancia una sola vez por carga.
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  })
}
