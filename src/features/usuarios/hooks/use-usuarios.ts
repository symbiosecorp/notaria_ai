import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  changeUsuarioPassword,
  createUsuario,
  deleteUsuario,
  getUsuario,
  listUsuarios,
  updateUsuario,
} from '../api/usuarios.service.ts'
import type {
  CambiarContrasenaInput,
  CreateUsuarioInput,
  UsuarioInput,
} from '../schemas.ts'

export const usuariosKeys = {
  all: ['usuarios'] as const,
  list: () => [...usuariosKeys.all, 'list'] as const,
  detail: (id: string) => [...usuariosKeys.all, 'detail', id] as const,
}

export const usuariosListOptions = () =>
  queryOptions({
    queryKey: usuariosKeys.list(),
    queryFn: listUsuarios,
  })

export const usuarioByIdOptions = (id: string) =>
  queryOptions({
    queryKey: usuariosKeys.detail(id),
    queryFn: () => getUsuario(id),
    enabled: Boolean(id),
  })

export function useCreateUsuario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateUsuarioInput) => createUsuario(input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: usuariosKeys.all }),
  })
}

export function useUpdateUsuario(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UsuarioInput) => updateUsuario(id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: usuariosKeys.all }),
  })
}

export function useDeleteUsuario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, currentUserId }: { id: string; currentUserId?: string }) =>
      deleteUsuario(id, currentUserId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: usuariosKeys.all }),
  })
}

export function useChangeUsuarioPassword(id: string) {
  return useMutation({
    mutationFn: (input: CambiarContrasenaInput) =>
      changeUsuarioPassword(id, input),
  })
}
