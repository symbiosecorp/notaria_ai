import { mockDb } from '#/lib/api/mock-db'
import { AppError } from '#/lib/errors/app-error'
import { createLogger } from '#/lib/errors/logger'
import { expedienteInputSchema, expedienteSchema } from '../schemas'
import type { Expediente, ExpedienteInput } from '../schemas'

const logger = createLogger('expedientes')
const FEATURE = 'expedientes'

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

function nextFolio(): string {
  const year = new Date().getFullYear()
  const n = mockDb.expedientes.length + 1
  return `EXP-${year}-${String(n).padStart(3, '0')}`
}

export async function listExpedientes(): Promise<Expediente[]> {
  logger.info('Listando expedientes')
  await delay()
  return expedienteSchema.array().parse(mockDb.expedientes)
}

export async function getExpediente(id: string): Promise<Expediente> {
  logger.info(`Obteniendo expediente ${id}`)
  await delay(150)
  const expediente = mockDb.expedientes.find((e) => e.id === id)
  if (!expediente) {
    throw new AppError('NOT_FOUND', `Expediente ${id} no encontrado`, FEATURE)
  }
  return expedienteSchema.parse(expediente)
}

export async function createExpediente(
  input: ExpedienteInput,
): Promise<Expediente> {
  logger.info('Creando expediente')
  await delay()
  const data = expedienteInputSchema.parse(input)
  const expediente: Expediente = {
    ...data,
    id: crypto.randomUUID(),
    folio: nextFolio(),
    fechaApertura: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  mockDb.expedientes.unshift(expediente)
  return expediente
}

export async function updateExpediente(
  id: string,
  input: ExpedienteInput,
): Promise<Expediente> {
  logger.info(`Actualizando expediente ${id}`)
  await delay()
  const index = mockDb.expedientes.findIndex((e) => e.id === id)
  if (index === -1) {
    throw new AppError('NOT_FOUND', `Expediente ${id} no encontrado`, FEATURE)
  }
  const data = expedienteInputSchema.parse(input)
  const updated: Expediente = {
    ...mockDb.expedientes[index],
    ...data,
    id,
    updatedAt: new Date(),
  }
  mockDb.expedientes[index] = updated
  return updated
}

export async function deleteExpediente(id: string): Promise<void> {
  logger.info(`Eliminando expediente ${id}`)
  await delay()
  const index = mockDb.expedientes.findIndex((e) => e.id === id)
  if (index === -1) {
    throw new AppError('NOT_FOUND', `Expediente ${id} no encontrado`, FEATURE)
  }
  mockDb.expedientes.splice(index, 1)
}
