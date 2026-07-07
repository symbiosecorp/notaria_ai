import { mockDb } from '#/lib/api/mock-db'
import { AppError } from '#/lib/errors/app-error'
import { createLogger } from '#/lib/errors/logger'
import { clienteInputSchema, clienteSchema } from '../schemas'
import type { Cliente, ClienteInput } from '../schemas'

// Fase 2 (Supabase): ver src/lib/supabase/ y supabase/migrations/ cuando conectes backend real.

const logger = createLogger('clientes')
const FEATURE = 'clientes'

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

export async function listClientes(): Promise<Cliente[]> {
  logger.info('Listando clientes')
  await delay()
  return clienteSchema.array().parse(mockDb.clientes)
}

export async function getCliente(id: string): Promise<Cliente> {
  logger.info(`Obteniendo cliente ${id}`)
  await delay(150)
  const cliente = mockDb.clientes.find((c) => c.id === id)
  if (!cliente) {
    throw new AppError('NOT_FOUND', `Cliente con id ${id} no encontrado`, FEATURE)
  }
  return clienteSchema.parse(cliente)
}

export async function createCliente(input: ClienteInput): Promise<Cliente> {
  logger.info('Creando cliente')
  await delay()
  const data = clienteInputSchema.parse(input)
  const cliente: Cliente = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  mockDb.clientes.unshift(cliente)
  return cliente
}

export async function updateCliente(
  id: string,
  input: ClienteInput,
): Promise<Cliente> {
  logger.info(`Actualizando cliente ${id}`)
  await delay()
  const index = mockDb.clientes.findIndex((c) => c.id === id)
  if (index === -1) {
    throw new AppError('NOT_FOUND', `Cliente con id ${id} no encontrado`, FEATURE)
  }
  const data = clienteInputSchema.parse(input)
  const updated: Cliente = {
    ...mockDb.clientes[index],
    ...data,
    id,
    updatedAt: new Date(),
  }
  mockDb.clientes[index] = updated
  return updated
}

export async function deleteCliente(id: string): Promise<void> {
  logger.info(`Eliminando cliente ${id}`)
  await delay()
  const index = mockDb.clientes.findIndex((c) => c.id === id)
  if (index === -1) {
    throw new AppError('NOT_FOUND', `Cliente con id ${id} no encontrado`, FEATURE)
  }
  mockDb.clientes.splice(index, 1)
}
