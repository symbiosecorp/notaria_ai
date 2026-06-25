import { faker } from '@faker-js/faker'
import {
  estatusClienteEnum,
  tipoPersonaEnum,
  estadoCivilEnum,
} from '#/features/clientes/schemas'
import type { Cliente } from '#/features/clientes/schemas'
import {
  estatusExpedienteEnum,
  tipoActoEnum,
} from '#/features/expedientes/schemas'
import type { Expediente } from '#/features/expedientes/schemas'
import {
  articuloArancelEnum,
  estatusCotizacionEnum,
} from '#/features/honorarios/schemas'
import type { Cotizacion } from '#/features/honorarios/schemas'
import { calcularArancel } from '#/features/honorarios/api/arancel'

export interface MockDb {
  clientes: Cliente[]
  expedientes: Expediente[]
  cotizaciones: Cotizacion[]
}

export const mockDb: MockDb = {
  clientes: [],
  expedientes: [],
  cotizaciones: [],
}

function generateCliente(): Cliente {
  const tipoPersona = faker.helpers.arrayElement(tipoPersonaEnum.options)
  const esFisica = tipoPersona === 'fisica'
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const nombre = esFisica
    ? `${firstName} ${lastName} ${faker.person.lastName()}`
    : faker.company.name()

  return {
    id: faker.string.uuid(),
    tipoPersona,
    nombre,
    rfc: faker.string
      .alphanumeric(esFisica ? 13 : 12)
      .toUpperCase(),
    email: faker.internet
      .email({ firstName, lastName, provider: 'example.com' })
      .toLowerCase(),
    telefono: faker.phone.number(),
    domicilio: faker.location.streetAddress({ useFullAddress: true }),
    estatus: faker.helpers.arrayElement(estatusClienteEnum.options),
    curp: esFisica ? faker.string.alphanumeric(18).toUpperCase() : '',
    nacionalidad: esFisica ? 'Mexicana' : '',
    estadoCivil: esFisica
      ? faker.helpers.arrayElement(estadoCivilEnum.options)
      : undefined,
    representanteLegal: esFisica ? '' : faker.person.fullName(),
    beneficiarioControlador: esFisica ? '' : faker.person.fullName(),
    esActividadVulnerable: faker.datatype.boolean(),
    notas: '',
    createdAt: faker.date.past({ years: 2 }),
    updatedAt: faker.date.recent({ days: 90 }),
  }
}

function generateExpediente(index: number, clientes: Cliente[]): Expediente {
  const cliente = faker.helpers.arrayElement(clientes)
  const tipoActo = faker.helpers.arrayElement(tipoActoEnum.options)
  const fechaApertura = faker.date.recent({ days: 180 })
  const conValor = ['compraventa', 'donacion', 'permuta', 'adjudicacion'].includes(
    tipoActo,
  )

  return {
    id: faker.string.uuid(),
    folio: `EXP-2026-${String(index + 1).padStart(3, '0')}`,
    tipoActo,
    descripcion: faker.lorem.sentence(),
    clienteId: cliente.id,
    clienteNombre: cliente.nombre,
    responsable: faker.person.fullName(),
    estatus: faker.helpers.arrayElement(estatusExpedienteEnum.options),
    fechaApertura,
    fechaLimite: faker.date.soon({ days: 60, refDate: fechaApertura }),
    documentosPendientes: faker.helpers.arrayElements(
      [
        'Identificación oficial',
        'Comprobante de domicilio',
        'Constancia de situación fiscal',
        'Avalúo',
        'Certificado de libertad de gravamen',
      ],
      { min: 0, max: 3 },
    ),
    valorOperacion: conValor
      ? faker.number.int({ min: 150_000, max: 4_500_000 })
      : undefined,
    notas: '',
    createdAt: fechaApertura,
    updatedAt: faker.date.recent({ days: 30 }),
  }
}

function generateCotizacion(index: number, clientes: Cliente[]): Cotizacion {
  const cliente = faker.helpers.arrayElement(clientes)
  const articulo = faker.helpers.arrayElement(articuloArancelEnum.options)
  const valorOperacion = faker.number.int({ min: 80_000, max: 3_000_000 })
  const descuento = faker.helpers.arrayElement([0, 0, 5, 10])
  const recargo = faker.helpers.arrayElement([0, 0, 0, 5])
  const calc = calcularArancel({ articulo, valorOperacion, descuento, recargo })
  const createdAt = faker.date.recent({ days: 120 })

  return {
    id: faker.string.uuid(),
    folio: `COT-2026-${String(index + 1).padStart(3, '0')}`,
    concepto: faker.lorem.words({ min: 2, max: 5 }),
    clienteId: cliente.id,
    clienteNombre: cliente.nombre,
    articulo,
    valorOperacion,
    honorarioBase: calc.honorarioBase,
    descuento,
    recargo,
    subtotal: calc.subtotal,
    iva: calc.iva,
    total: calc.total,
    estatus: faker.helpers.arrayElement(estatusCotizacionEnum.options),
    createdAt,
    updatedAt: createdAt,
  }
}

let seeded = false

export function seedMockDb() {
  if (seeded) return
  mockDb.clientes = Array.from({ length: 24 }, generateCliente)
  mockDb.expedientes = Array.from({ length: 18 }, (_, i) =>
    generateExpediente(i, mockDb.clientes),
  )
  mockDb.cotizaciones = Array.from({ length: 14 }, (_, i) =>
    generateCotizacion(i, mockDb.clientes),
  )
  seeded = true
}

export function resetMockDb() {
  mockDb.clientes = []
  mockDb.expedientes = []
  mockDb.cotizaciones = []
  seeded = false
}
