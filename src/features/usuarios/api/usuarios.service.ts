import { createLogger } from '#/lib/errors/logger'
import {
  changeUsuarioPasswordFn,
  createUsuarioFn,
  deleteUsuarioFn,
  getUsuarioFn,
  listUsuariosFn,
  updateUsuarioFn,
} from './usuarios-api.ts'
import type {
  CambiarContrasenaInput,
  CreateUsuarioInput,
  Usuario,
  UsuarioInput,
} from '../schemas.ts'

const logger = createLogger('usuarios')

/**
 * Capa de servicio del cliente: delega en server functions.
 * Los hooks y componentes no cambian al migrar mock → Supabase.
 */
export async function listUsuarios(): Promise<Usuario[]> {
  logger.info('Listando usuarios (server fn)')
  return listUsuariosFn()
}

export async function getUsuario(id: string): Promise<Usuario> {
  logger.info(`Obteniendo usuario ${id} (server fn)`)
  return getUsuarioFn({ data: { id } })
}

export async function createUsuario(input: CreateUsuarioInput): Promise<Usuario> {
  logger.info('Creando usuario (server fn)')
  return createUsuarioFn({ data: input })
}

export async function updateUsuario(
  id: string,
  input: UsuarioInput,
): Promise<Usuario> {
  logger.info(`Actualizando usuario ${id} (server fn)`)
  return updateUsuarioFn({ data: { id, input } })
}

export async function deleteUsuario(
  id: string,
  currentUserId?: string,
): Promise<void> {
  logger.info(`Eliminando usuario ${id} (server fn)`)
  // currentUserId lo resuelve el servidor desde la sesión; se mantiene la firma
  // por compatibilidad con hooks existentes.
  void currentUserId
  await deleteUsuarioFn({ data: { id } })
}

export async function changeUsuarioPassword(
  id: string,
  input: CambiarContrasenaInput,
): Promise<void> {
  logger.info(`Cambiando contraseña del usuario ${id} (server fn)`)
  await changeUsuarioPasswordFn({ data: { id, input } })
}
