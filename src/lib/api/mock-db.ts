import { faker } from '@faker-js/faker'
import type { Cliente } from '#/features/clientes/schemas'

export interface MockDb {
  clientes: Cliente[]
  // Placeholder para features futuras; se tipa como unknown[] para evitar
  // dependencias circulares entre el mock-db y features en desarrollo.
  templates?: unknown[]
}

export const mockDb: MockDb = {
  clientes: [],
  templates: [],
}

function generateClientes(count = 25): Cliente[] {
  return Array.from({ length: count }, () => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const nombre = `${firstName} ${lastName}`
    const email = faker.internet
      .email({ firstName, lastName, provider: 'example.com' })
      .toLowerCase()

    return {
      id: faker.string.uuid(),
      nombre,
      email,
      telefono: faker.phone.number(),
      curp: faker.string.alphanumeric(18).toUpperCase(),
      rfc: faker.string.alphanumeric(13).toUpperCase(),
      domicilio: faker.location.streetAddress({ useFullAddress: true }),
      createdAt: faker.date.past({ years: 2 }),
      updatedAt: faker.date.recent({ days: 90 }),
    }
  })
}

let seeded = false

export function seedMockDb() {
  if (seeded) return
  mockDb.clientes = generateClientes()
  seeded = true
}

export function resetMockDb() {
  mockDb.clientes = []
  seeded = false
}
