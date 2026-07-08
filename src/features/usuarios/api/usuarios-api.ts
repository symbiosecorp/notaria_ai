import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { isSupabaseAdminConfigured } from '#/lib/api/data-source.ts'
import { requireServerPermission } from '#/lib/api/server-auth.ts'
import { rethrowAsAppError } from '#/lib/api/server-errors.ts'
import {
  cambiarContrasenaInputSchema,
  createUsuarioInputSchema,
  usuarioInputSchema,
} from '../schemas.ts'
import * as mockRepo from './usuarios.repository.mock.ts'
import * as supabaseRepo from './usuarios.repository.supabase.ts'

const idSchema = z.object({ id: z.string().min(1) })

const updatePayloadSchema = z.object({
  id: z.string().min(1),
  input: usuarioInputSchema,
})

const deletePayloadSchema = z.object({
  id: z.string().min(1),
})

const changePasswordPayloadSchema = z.object({
  id: z.string().min(1),
  input: cambiarContrasenaInputSchema,
})

function useSupabaseBackend() {
  return isSupabaseAdminConfigured()
}

export const listUsuariosFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      await requireServerPermission('configuracion:view')
      if (useSupabaseBackend()) {
        return await supabaseRepo.listUsuariosSupabase()
      }
      return await mockRepo.listUsuariosMock()
    } catch (error) {
      rethrowAsAppError(error, 'usuarios')
    }
  },
)

export const getUsuarioFn = createServerFn({ method: 'POST' })
  .validator(idSchema)
  .handler(async ({ data }) => {
    try {
      await requireServerPermission('configuracion:view')
      if (useSupabaseBackend()) {
        return await supabaseRepo.getUsuarioSupabase(data.id)
      }
      return await mockRepo.getUsuarioMock(data.id)
    } catch (error) {
      rethrowAsAppError(error, 'usuarios')
    }
  })

export const createUsuarioFn = createServerFn({ method: 'POST' })
  .validator(createUsuarioInputSchema)
  .handler(async ({ data }) => {
    try {
      await requireServerPermission('usuarios:manage')
      if (useSupabaseBackend()) {
        return await supabaseRepo.createUsuarioSupabase(data)
      }
      return await mockRepo.createUsuarioMock(data)
    } catch (error) {
      rethrowAsAppError(error, 'usuarios')
    }
  })

export const updateUsuarioFn = createServerFn({ method: 'POST' })
  .validator(updatePayloadSchema)
  .handler(async ({ data }) => {
    try {
      await requireServerPermission('usuarios:manage')
      if (useSupabaseBackend()) {
        return await supabaseRepo.updateUsuarioSupabase(data.id, data.input)
      }
      return await mockRepo.updateUsuarioMock(data.id, data.input)
    } catch (error) {
      rethrowAsAppError(error, 'usuarios')
    }
  })

export const deleteUsuarioFn = createServerFn({ method: 'POST' })
  .validator(deletePayloadSchema)
  .handler(async ({ data }) => {
    try {
      const user = await requireServerPermission('usuarios:manage')
      if (useSupabaseBackend()) {
        await supabaseRepo.deleteUsuarioSupabase(data.id, user.id)
        return
      }
      await mockRepo.deleteUsuarioMock(data.id, user.id)
    } catch (error) {
      rethrowAsAppError(error, 'usuarios')
    }
  })

export const changeUsuarioPasswordFn = createServerFn({ method: 'POST' })
  .validator(changePasswordPayloadSchema)
  .handler(async ({ data }) => {
    try {
      await requireServerPermission('usuarios:manage')
      if (useSupabaseBackend()) {
        await supabaseRepo.changeUsuarioPasswordSupabase(data.id, data.input)
        return
      }
      await mockRepo.changeUsuarioPasswordMock(data.id, data.input)
    } catch (error) {
      rethrowAsAppError(error, 'usuarios')
    }
  })
