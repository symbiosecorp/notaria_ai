import { mockDb } from '#/lib/api/mock-db'
import { AppError } from '#/lib/errors/app-error'
import { createLogger } from '#/lib/errors/logger'
import type { Template } from '../schemas'

const logger = createLogger('template')
const FEATURE = 'template'

export async function listTemplates(): Promise<Template[]> {
  logger.info('Listando templates')
  await new Promise((resolve) => setTimeout(resolve, 300))
  return (mockDb.templates || []) as Template[]
}

export async function getTemplate(id: string): Promise<Template> {
  logger.info(`Obteniendo template ${id}`)
  await new Promise((resolve) => setTimeout(resolve, 200))
  const items = (mockDb.templates || []) as Template[]
  const item = items.find((t) => t.id === id)
  if (!item) {
    throw new AppError('NOT_FOUND', `Template ${id} no encontrado`, FEATURE)
  }
  return item
}
