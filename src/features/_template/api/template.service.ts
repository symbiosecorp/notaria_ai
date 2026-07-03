import { AppError } from '#/lib/errors/app-error'
import { createLogger } from '#/lib/errors/logger'
import type { Template } from '../schemas'

const logger = createLogger('template')
const FEATURE = 'template'

// Almacén en memoria de ejemplo. Al clonar la plantilla, reemplázalo por una
// colección en `src/lib/api/mock-db.ts` (o por llamadas `fetch` a la API real).
const store: Template[] = []

export async function listTemplates(): Promise<Template[]> {
  logger.info('Listando templates')
  await new Promise((resolve) => setTimeout(resolve, 300))
  return store
}

export async function getTemplate(id: string): Promise<Template> {
  logger.info(`Obteniendo template ${id}`)
  await new Promise((resolve) => setTimeout(resolve, 200))
  const item = store.find((t) => t.id === id)
  if (!item) {
    throw new AppError('NOT_FOUND', `Template ${id} no encontrado`, FEATURE)
  }
  return item
}
