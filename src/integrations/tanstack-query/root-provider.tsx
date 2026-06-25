import { createQueryClient } from '#/lib/api/query-client'

export function getContext() {
  return {
    queryClient: createQueryClient(),
  }
}

export default function TanstackQueryProvider() {
  return null
}
