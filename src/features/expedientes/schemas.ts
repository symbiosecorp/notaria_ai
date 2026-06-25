import { z } from 'zod'

export const tipoActoEnum = z.enum([
  'compraventa',
  'donacion',
  'permuta',
  'adjudicacion',
  'poder',
  'sucesion',
  'sociedad',
  'protocolizacion',
  'cancelacion_hipoteca',
  'regimen_condominio',
  'fe_hechos',
  'ratificacion',
  'cotejo',
  'otro',
])
export type TipoActo = z.infer<typeof tipoActoEnum>
export const tipoActoLabels: Record<TipoActo, string> = {
  compraventa: 'Compraventa',
  donacion: 'Donación',
  permuta: 'Permuta',
  adjudicacion: 'Adjudicación',
  poder: 'Poder',
  sucesion: 'Sucesión',
  sociedad: 'Sociedad',
  protocolizacion: 'Protocolización',
  cancelacion_hipoteca: 'Cancelación de hipoteca',
  regimen_condominio: 'Régimen de condominio',
  fe_hechos: 'Fe de hechos',
  ratificacion: 'Ratificación',
  cotejo: 'Cotejo',
  otro: 'Otro acto notarial',
}

export const estatusExpedienteEnum = z.enum([
  'abierto',
  'en_proceso',
  'en_revision',
  'listo_firma',
  'firmado',
  'inscrito',
  'cerrado',
  'cancelado',
])
export type EstatusExpediente = z.infer<typeof estatusExpedienteEnum>
export const estatusExpedienteLabels: Record<EstatusExpediente, string> = {
  abierto: 'Abierto',
  en_proceso: 'En proceso',
  en_revision: 'En revisión',
  listo_firma: 'Listo para firma',
  firmado: 'Firmado',
  inscrito: 'Inscrito',
  cerrado: 'Cerrado',
  cancelado: 'Cancelado',
}

export const expedienteSchema = z.object({
  id: z.string(),
  folio: z.string(),
  tipoActo: tipoActoEnum,
  descripcion: z.string().optional().or(z.literal('')),
  clienteId: z.string().min(1, 'Selecciona un cliente'),
  clienteNombre: z.string(),
  responsable: z.string().min(1, 'Indica un responsable'),
  estatus: estatusExpedienteEnum,
  fechaApertura: z.coerce.date(),
  fechaLimite: z.coerce.date().optional(),
  documentosPendientes: z.array(z.string()),
  valorOperacion: z.number().nonnegative().optional(),
  notas: z.string().optional().or(z.literal('')),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
})
export type Expediente = z.infer<typeof expedienteSchema>

export const expedienteInputSchema = expedienteSchema
  .omit({
    id: true,
    folio: true,
    fechaApertura: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    estatus: estatusExpedienteEnum.default('abierto'),
    documentosPendientes: z.array(z.string()).default([]),
  })
export type ExpedienteInput = z.infer<typeof expedienteInputSchema>

// Conjunto de estatus considerados "activos" para indicadores.
export const estatusExpedienteAbierto: EstatusExpediente[] = [
  'abierto',
  'en_proceso',
  'en_revision',
  'listo_firma',
]
