import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  createExpediente,
  deleteExpediente,
  getExpediente,
  listExpedientes,
  updateExpediente,
} from '../api/expedientes.service'
import type { ExpedienteInput } from '../schemas'

export const expedientesKeys = {
  all: ['expedientes'] as const,
  list: () => [...expedientesKeys.all, 'list'] as const,
  detail: (id: string) => [...expedientesKeys.all, 'detail', id] as const,
}

export const expedientesListOptions = () =>
  queryOptions({
    queryKey: expedientesKeys.list(),
    queryFn: listExpedientes,
  })

export const expedienteByIdOptions = (id: string) =>
  queryOptions({
    queryKey: expedientesKeys.detail(id),
    queryFn: () => getExpediente(id),
    enabled: Boolean(id),
  })

export function useCreateExpediente() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ExpedienteInput) => createExpediente(input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: expedientesKeys.all }),
  })
}

export function useUpdateExpediente(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ExpedienteInput) => updateExpediente(id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: expedientesKeys.all }),
  })
}

export function useDeleteExpediente() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteExpediente(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: expedientesKeys.all }),
  })
}
