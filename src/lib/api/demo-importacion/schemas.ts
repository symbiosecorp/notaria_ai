import { z } from 'zod'
import { clienteInputSchema } from '#/features/clientes/schemas'
import { expedienteInputSchema, tipoActoEnum } from '#/features/expedientes/schemas'

export const importStepEnum = z.enum([
  'uploading',
  'extracting',
  'detecting',
  'generating',
  'done',
])
export type ImportStep = z.infer<typeof importStepEnum>

export const importStepLabels: Record<ImportStep, string> = {
  uploading: 'Preparando lectura…',
  extracting: 'Extrayendo texto…',
  detecting: 'Identificando tipo de acto…',
  generating: 'Llenando expediente…',
  done: 'Completado',
}

export const importDraftSchema = z.object({
  localId: z.string(),
  fileName: z.string(),
  fileSize: z.number(),
  mimeType: z.string(),
  tipoActo: tipoActoEnum,
  clienteInput: clienteInputSchema,
  expedienteInput: expedienteInputSchema.omit({
    clienteId: true,
    clienteNombre: true,
  }),
})
export type ImportDraft = z.infer<typeof importDraftSchema>

export const importResultSchema = z.object({
  clienteId: z.string(),
  clienteNombre: z.string(),
  expedienteId: z.string(),
  expedienteFolio: z.string(),
  tipoActo: tipoActoEnum,
  fileName: z.string(),
  storagePath: z.string().optional(),
})
export type ImportResult = z.infer<typeof importResultSchema>

export const demoFileNames = [
  'compraventa_garcia_lopez.pdf',
  'donacion_martinez_ruiz.docx',
  'permuta_rodriguez_sanchez.pdf',
  'adjudicacion_hernandez_torres.pdf',
  'poder_sanchez_mendoza.pdf',
] as const

export const DEMO_TIPOS = [
  'compraventa',
  'donacion',
  'permuta',
  'adjudicacion',
  'poder',
] as const

export type DemoTipoActo = (typeof DEMO_TIPOS)[number]
