import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { requireServerPermission } from '#/lib/api/server-auth.ts'
import { rethrowAsAppError } from '#/lib/api/server-errors.ts'
// Al migrar a Supabase: importa getSupabaseAdminClient o el repo *.repository.supabase.ts
import { listTemplates } from './template.service.ts'

const idSchema = z.object({ id: z.string().min(1) })

/**
 * Plantilla de server function por feature.
 * 1. Valida permisos con requireServerPermission (o requireServerAuth).
 * 2. Ejecuta lógica de backend (Supabase admin / RLS / mock en servidor).
 * 3. Mapea errores con rethrowAsAppError.
 *
 * El *.service.ts del cliente solo delega aquí; los hooks no cambian.
 */
export const listTemplatesFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      await requireServerPermission('dashboard:view')
      // TODO: reemplazar listTemplates() mock por consulta real
      return await listTemplates()
    } catch (error) {
      rethrowAsAppError(error, 'template')
    }
  },
)

export const getTemplateFn = createServerFn({ method: 'POST' })
  .validator(idSchema)
  .handler(async ({ data: { id } }) => {
    try {
      await requireServerPermission('dashboard:view')
      // TODO: implementar get contra backend real
      void id
      throw new Error('Pendiente de migración a backend')
    } catch (error) {
      rethrowAsAppError(error, 'template')
    }
  })
