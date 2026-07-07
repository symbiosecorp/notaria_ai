import { mockDb } from '#/lib/api/mock-db'
import { AppError } from '#/lib/errors/app-error'
import { createLogger } from '#/lib/errors/logger'
import { clienteInputSchema } from '#/features/clientes/schemas'
import type { Cliente, ClienteInput } from '#/features/clientes/schemas'
import { expedienteInputSchema } from '#/features/expedientes/schemas'
import type { Expediente, ExpedienteInput } from '#/features/expedientes/schemas'
import {
  buildDraftFromFile,
  resolveTipoActo,
} from './extraction-templates.ts'
import {
  importDraftSchema,
  importResultSchema,
  importStepEnum,
} from './schemas.ts'
import type { ImportDraft, ImportResult, ImportStep } from './schemas.ts'

const logger = createLogger('demo-importacion')
const FEATURE = 'demo-importacion'

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

export interface ImportProgressEvent {
  fileName: string
  step: ImportStep
  progress: number
  fileIndex: number
  totalFiles: number
}

function nextFolio(): string {
  const year = new Date().getFullYear()
  const n = mockDb.expedientes.length + 1
  return `EXP-${year}-${String(n).padStart(3, '0')}`
}

async function createClienteRecord(input: ClienteInput): Promise<Cliente> {
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

async function createExpedienteRecord(
  input: ExpedienteInput,
): Promise<Expediente> {
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

function buildDraft(
  file: File,
  fileIndex: number,
  sharedClienteInput: ClienteInput,
): ImportDraft {
  const tipoActo = resolveTipoActo(file.name, fileIndex)
  const { expedienteInput } = buildDraftFromFile(file.name, tipoActo)

  return importDraftSchema.parse({
    localId: crypto.randomUUID(),
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type || 'application/octet-stream',
    tipoActo,
    clienteInput: sharedClienteInput,
    expedienteInput,
  })
}

export async function analyzeFiles(
  files: File[],
  onProgress?: (event: ImportProgressEvent) => void,
): Promise<ImportDraft[]> {
  if (files.length === 0) {
    throw new AppError('VALIDATION_ERROR', 'Selecciona al menos un archivo', FEATURE)
  }

  const drafts: ImportDraft[] = []
  const firstTipo = resolveTipoActo(files[0].name, 0)
  const { clienteInput: sharedClienteInput } = buildDraftFromFile(
    files[0].name,
    firstTipo,
  )

  for (const [index, file] of files.entries()) {
    const baseProgress = (index / files.length) * 100

    for (const step of importStepEnum.options.slice(0, 4)) {
      onProgress?.({
        fileName: file.name,
        step,
        progress:
          baseProgress +
          (importStepEnum.options.indexOf(step) + 1) * (100 / files.length / 5),
        fileIndex: index + 1,
        totalFiles: files.length,
      })
      await delay(step === 'extracting' ? 900 : 400)
    }

    drafts.push(buildDraft(file, index, sharedClienteInput))
  }

  onProgress?.({
    fileName: files.at(-1)?.name ?? '',
    step: 'done',
    progress: 100,
    fileIndex: files.length,
    totalFiles: files.length,
  })

  return drafts
}

export async function importDrafts(drafts: ImportDraft[]): Promise<ImportResult[]> {
  if (drafts.length === 0) {
    throw new AppError('VALIDATION_ERROR', 'No hay borradores para importar', FEATURE)
  }

  const cliente = await createClienteRecord(drafts[0].clienteInput)
  const results: ImportResult[] = []

  for (const draft of drafts) {
    const parsed = importDraftSchema.parse(draft)
    const expediente = await createExpedienteRecord({
      ...parsed.expedienteInput,
      clienteId: cliente.id,
      clienteNombre: cliente.nombre,
      notas: [
        parsed.expedienteInput.notas,
        `Documento leído (demo): ${parsed.fileName}`,
      ]
        .filter(Boolean)
        .join('\n'),
    })

    results.push(
      importResultSchema.parse({
        clienteId: cliente.id,
        clienteNombre: cliente.nombre,
        expedienteId: expediente.id,
        expedienteFolio: expediente.folio,
        tipoActo: parsed.tipoActo,
        fileName: parsed.fileName,
      }),
    )
  }

  logger.info(`Demo: ${results.length} expediente(s) mock para ${cliente.nombre}`)
  return results
}

/** Simula lectura OCR y crea cliente + expedientes en mockDb. */
export async function processImportFiles(
  files: File[],
  onProgress?: (event: ImportProgressEvent) => void,
): Promise<ImportResult[]> {
  const drafts = await analyzeFiles(files, onProgress)
  return importDrafts(drafts)
}

export function getImportBackendLabel(): string {
  return 'Demo (mock en memoria)'
}
