import { faker } from '@faker-js/faker'
import type { ClienteInput } from '#/features/clientes/schemas'
import type { ExpedienteInput } from '#/features/expedientes/schemas'
import type { DemoTipoActo } from './schemas.ts'

const DEMO_TIPOS: DemoTipoActo[] = [
  'compraventa',
  'donacion',
  'permuta',
  'adjudicacion',
  'poder',
]

const ACTO_ALIASES: Record<DemoTipoActo, string[]> = {
  compraventa: ['compraventa', 'cv', 'escritura_cv', 'venta'],
  donacion: ['donacion', 'donación', 'donativo'],
  permuta: ['permuta', 'canje'],
  adjudicacion: ['adjudicacion', 'adjudicación', 'adjudica'],
  poder: ['poder', 'apoderamiento', 'mandato'],
}

const DOCUMENTOS_POR_ACTO: Record<DemoTipoActo, string[]> = {
  compraventa: [
    'Identificación oficial',
    'Comprobante de domicilio',
    'Avalúo',
    'Certificado de libertad de gravamen',
  ],
  donacion: [
    'Identificación oficial',
    'Comprobante de domicilio',
    'Constancia de situación fiscal',
  ],
  permuta: [
    'Identificación oficial',
    'Avalúo inmueble A',
    'Avalúo inmueble B',
    'Certificado de libertad de gravamen',
  ],
  adjudicacion: [
    'Identificación oficial',
    'Resolución judicial',
    'Certificado de libertad de gravamen',
  ],
  poder: [
    'Identificación oficial',
    'Comprobante de domicilio',
    'Datos del apoderado',
  ],
}

const DESCRIPCIONES: Record<DemoTipoActo, string> = {
  compraventa: 'Escritura de compraventa de inmueble',
  donacion: 'Escritura de donación de bien inmueble',
  permuta: 'Escritura de permuta de inmuebles',
  adjudicacion: 'Escritura de adjudicación judicial',
  poder: 'Poder general para actos de administración',
}

const CON_VALOR: DemoTipoActo[] = [
  'compraventa',
  'donacion',
  'permuta',
  'adjudicacion',
]

export function resolveTipoActo(fileName: string, index: number): DemoTipoActo {
  return detectTipoActo(fileName) ?? DEMO_TIPOS[index % DEMO_TIPOS.length]
}

export function detectTipoActo(fileName: string): DemoTipoActo | null {
  const normalized = fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

  for (const [tipo, aliases] of Object.entries(ACTO_ALIASES) as [
    DemoTipoActo,
    string[],
  ][]) {
    if (aliases.some((alias) => normalized.includes(alias))) {
      return tipo
    }
  }

  return null
}

function slugFromFileName(fileName: string): string {
  return fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(
      /\b(compraventa|donacion|donación|permuta|adjudicacion|adjudicación|poder)\b/gi,
      '',
    )
    .trim()
}

function buildNombre(fileName: string): string {
  const slug = slugFromFileName(fileName)
  if (slug.length >= 3) {
    return slug
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ')
  }
  return faker.person.fullName()
}

export function buildDraftFromFile(
  fileName: string,
  tipoActo: DemoTipoActo,
): {
  clienteInput: ClienteInput
  expedienteInput: Omit<ExpedienteInput, 'clienteId' | 'clienteNombre'>
} {
  const esFisica = faker.datatype.boolean({ probability: 0.8 })
  const nombre = buildNombre(fileName)
  const firstName = nombre.split(' ')[0] ?? 'Cliente'
  const lastName = nombre.split(' ').slice(1).join(' ') || faker.person.lastName()

  const clienteInput: ClienteInput = {
    tipoPersona: esFisica ? 'fisica' : 'moral',
    nombre: esFisica ? nombre : `${nombre} S.A. de C.V.`,
    rfc: faker.string.alphanumeric(esFisica ? 13 : 12).toUpperCase(),
    email: faker.internet
      .email({ firstName, lastName, provider: 'example.com' })
      .toLowerCase(),
    telefono: faker.phone.number(),
    domicilio: faker.location.streetAddress({ useFullAddress: true }),
    estatus: 'activo',
    curp: esFisica ? faker.string.alphanumeric(18).toUpperCase() : '',
    nacionalidad: esFisica ? 'Mexicana' : '',
    estadoCivil: esFisica
      ? faker.helpers.arrayElement([
          'soltero',
          'casado',
          'divorciado',
          'viudo',
          'union_libre',
        ] as const)
      : undefined,
    representanteLegal: esFisica ? '' : faker.person.fullName(),
    beneficiarioControlador: esFisica ? '' : faker.person.fullName(),
    esActividadVulnerable: faker.datatype.boolean({ probability: 0.15 }),
    notas: `Importado desde ${fileName}`,
  }

  const pendientes = DOCUMENTOS_POR_ACTO[tipoActo]

  const expedienteInput: Omit<ExpedienteInput, 'clienteId' | 'clienteNombre'> = {
    tipoActo,
    descripcion: DESCRIPCIONES[tipoActo],
    responsable: faker.person.fullName(),
    estatus: 'abierto',
    fechaLimite: faker.date.soon({ days: 45 }),
    documentosPendientes: faker.helpers.arrayElements(pendientes, {
      min: 2,
      max: pendientes.length,
    }),
    valorOperacion: CON_VALOR.includes(tipoActo)
      ? faker.number.int({ min: 180_000, max: 3_800_000 })
      : undefined,
    notas: `Documento fuente: ${fileName}`,
  }

  return { clienteInput, expedienteInput }
}
