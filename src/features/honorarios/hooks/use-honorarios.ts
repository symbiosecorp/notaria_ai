import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  createCotizacion,
  deleteCotizacion,
  getCotizacion,
  listCotizaciones,
  updateCotizacion,
} from '../api/honorarios.service'
import type { CotizacionInput } from '../schemas'

export const cotizacionesKeys = {
  all: ['cotizaciones'] as const,
  list: () => [...cotizacionesKeys.all, 'list'] as const,
  detail: (id: string) => [...cotizacionesKeys.all, 'detail', id] as const,
}

export const cotizacionesListOptions = () =>
  queryOptions({
    queryKey: cotizacionesKeys.list(),
    queryFn: listCotizaciones,
  })

export const cotizacionByIdOptions = (id: string) =>
  queryOptions({
    queryKey: cotizacionesKeys.detail(id),
    queryFn: () => getCotizacion(id),
    enabled: Boolean(id),
  })

export function useCreateCotizacion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CotizacionInput) => createCotizacion(input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: cotizacionesKeys.all }),
  })
}

export function useUpdateCotizacion(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CotizacionInput) => updateCotizacion(id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: cotizacionesKeys.all }),
  })
}

export function useDeleteCotizacion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCotizacion(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: cotizacionesKeys.all }),
  })
}
