import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  createCliente,
  deleteCliente,
  getCliente,
  listClientes,
  updateCliente,
} from '../api/clientes.service'
import type { ClienteInput } from '../schemas'

export const clientesKeys = {
  all: ['clientes'] as const,
  list: () => [...clientesKeys.all, 'list'] as const,
  detail: (id: string) => [...clientesKeys.all, 'detail', id] as const,
}

export const clientesListOptions = () =>
  queryOptions({
    queryKey: clientesKeys.list(),
    queryFn: listClientes,
  })

export const clienteByIdOptions = (id: string) =>
  queryOptions({
    queryKey: clientesKeys.detail(id),
    queryFn: () => getCliente(id),
    enabled: Boolean(id),
  })

export function useCreateCliente() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ClienteInput) => createCliente(input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: clientesKeys.all }),
  })
}

export function useUpdateCliente(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ClienteInput) => updateCliente(id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: clientesKeys.all }),
  })
}

export function useDeleteCliente() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCliente(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: clientesKeys.all }),
  })
}
