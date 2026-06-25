import { mockDb } from '#/lib/api/mock-db'
import { AppError } from '#/lib/errors/app-error'
import { createLogger } from '#/lib/errors/logger'
import { clienteSchema } from '../schemas'
import type { Cliente } from '../schemas'

const logger = createLogger('clientes')
const FEATURE = 'clientes'

export async function listClientes(): Promise<Cliente[]> {
  logger.info('Listando clientes')
  await new Promise((resolve) => setTimeout(resolve, 300))
  // Validación en el límite: garantiza que lo que sale del service cumple el schema.
  return clienteSchema.array().parse(mockDb.clientes)
}

export async function getCliente(id: string): Promise<Cliente> {
  logger.info(`Obteniendo cliente ${id}`)
  await new Promise((resolve) => setTimeout(resolve, 200))
  const cliente = mockDb.clientes.find((c) => c.id === id)
  if (!cliente) {
    throw new AppError(
      'NOT_FOUND',
      `Cliente con id ${id} no encontrado`,
      FEATURE,
    )
  }
  return clienteSchema.parse(cliente)
}
