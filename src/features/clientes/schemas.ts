import { z } from 'zod'

export const tipoPersonaEnum = z.enum(['fisica', 'moral'])
export type TipoPersona = z.infer<typeof tipoPersonaEnum>
export const tipoPersonaLabels: Record<TipoPersona, string> = {
  fisica: 'Persona física',
  moral: 'Persona moral',
}

export const estadoCivilEnum = z.enum([
  'soltero',
  'casado',
  'divorciado',
  'viudo',
  'union_libre',
])
export type EstadoCivil = z.infer<typeof estadoCivilEnum>
export const estadoCivilLabels: Record<EstadoCivil, string> = {
  soltero: 'Soltero(a)',
  casado: 'Casado(a)',
  divorciado: 'Divorciado(a)',
  viudo: 'Viudo(a)',
  union_libre: 'Unión libre',
}

export const estatusClienteEnum = z.enum(['prospecto', 'activo', 'inactivo'])
export type EstatusCliente = z.infer<typeof estatusClienteEnum>
export const estatusClienteLabels: Record<EstatusCliente, string> = {
  prospecto: 'Prospecto',
  activo: 'Activo',
  inactivo: 'Inactivo',
}

export const clienteSchema = z.object({
  id: z.string(),
  tipoPersona: tipoPersonaEnum,
  // Nombre completo (PF) o razón social (PM)
  nombre: z.string().min(1, 'El nombre o razón social es obligatorio'),
  rfc: z.string().optional().or(z.literal('')),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefono: z.string().optional().or(z.literal('')),
  domicilio: z.string().optional().or(z.literal('')),
  estatus: estatusClienteEnum,
  // Persona física
  curp: z.string().optional().or(z.literal('')),
  nacionalidad: z.string().optional().or(z.literal('')),
  estadoCivil: estadoCivilEnum.optional(),
  // Persona moral
  representanteLegal: z.string().optional().or(z.literal('')),
  // Cumplimiento UIF / PLD
  beneficiarioControlador: z.string().optional().or(z.literal('')),
  esActividadVulnerable: z.boolean(),
  notas: z.string().optional().or(z.literal('')),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
})
export type Cliente = z.infer<typeof clienteSchema>

// Los valores por defecto los aporta el formulario (no el schema), para que el
// tipo de entrada del validador coincida con los datos del form en TanStack Form.
export const clienteInputSchema = clienteSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
export type ClienteInput = z.infer<typeof clienteInputSchema>
