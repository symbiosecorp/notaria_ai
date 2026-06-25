import { mockDb } from '#/lib/api/mock-db'
import { AppError } from '#/lib/errors/app-error'
import { createLogger } from '#/lib/errors/logger'
import { cotizacionInputSchema, cotizacionSchema } from '../schemas'
import type { Cotizacion, CotizacionInput } from '../schemas'
import { calcularArancel } from './arancel'

const logger = createLogger('honorarios')
const FEATURE = 'honorarios'

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

function nextFolio(): string {
  const year = new Date().getFullYear()
  const n = mockDb.cotizaciones.length + 1
  return `COT-${year}-${String(n).padStart(3, '0')}`
}

function withCalculo(data: CotizacionInput) {
  const calc = calcularArancel({
    articulo: data.articulo,
    valorOperacion: data.valorOperacion,
    descuento: data.descuento,
    recargo: data.recargo,
  })
  return {
    honorarioBase: calc.honorarioBase,
    subtotal: calc.subtotal,
    iva: calc.iva,
    total: calc.total,
  }
}

export async function listCotizaciones(): Promise<Cotizacion[]> {
  logger.info('Listando cotizaciones')
  await delay()
  return cotizacionSchema.array().parse(mockDb.cotizaciones)
}

export async function getCotizacion(id: string): Promise<Cotizacion> {
  logger.info(`Obteniendo cotización ${id}`)
  await delay(150)
  const cotizacion = mockDb.cotizaciones.find((c) => c.id === id)
  if (!cotizacion) {
    throw new AppError('NOT_FOUND', `Cotización ${id} no encontrada`, FEATURE)
  }
  return cotizacionSchema.parse(cotizacion)
}

export async function createCotizacion(
  input: CotizacionInput,
): Promise<Cotizacion> {
  logger.info('Creando cotización')
  await delay()
  const data = cotizacionInputSchema.parse(input)
  const cotizacion: Cotizacion = {
    ...data,
    id: crypto.randomUUID(),
    folio: nextFolio(),
    ...withCalculo(data),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  mockDb.cotizaciones.unshift(cotizacion)
  return cotizacion
}

export async function updateCotizacion(
  id: string,
  input: CotizacionInput,
): Promise<Cotizacion> {
  logger.info(`Actualizando cotización ${id}`)
  await delay()
  const index = mockDb.cotizaciones.findIndex((c) => c.id === id)
  if (index === -1) {
    throw new AppError('NOT_FOUND', `Cotización ${id} no encontrada`, FEATURE)
  }
  const data = cotizacionInputSchema.parse(input)
  const updated: Cotizacion = {
    ...mockDb.cotizaciones[index],
    ...data,
    id,
    ...withCalculo(data),
    updatedAt: new Date(),
  }
  mockDb.cotizaciones[index] = updated
  return updated
}

export async function deleteCotizacion(id: string): Promise<void> {
  logger.info(`Eliminando cotización ${id}`)
  await delay()
  const index = mockDb.cotizaciones.findIndex((c) => c.id === id)
  if (index === -1) {
    throw new AppError('NOT_FOUND', `Cotización ${id} no encontrada`, FEATURE)
  }
  mockDb.cotizaciones.splice(index, 1)
}
