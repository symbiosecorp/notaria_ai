import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { ArrowLeft, FileStack, Sparkles } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { PageHeader } from '#/components/common/page-header'
import { AppErrorBoundary } from '#/lib/errors/error-boundary'
import { FileUploadZone } from '#/components/demo-importacion/file-upload-zone.tsx'
import { ImportProgress } from '#/components/demo-importacion/import-progress.tsx'
import { ImportPreviewTable } from '#/components/demo-importacion/import-preview-table.tsx'
import {
  demoFileNames,
  useAnalyzeImportFiles,
  useImportDrafts,
} from '#/lib/api/demo-importacion'
import type {
  ImportDraft,
  ImportProgressEvent,
} from '#/lib/api/demo-importacion'
import { clientesKeys } from '#/features/clientes'
import { expedientesKeys } from '#/features/expedientes'

export const Route = createFileRoute('/_app/clientes/importar')({
  component: ClientesImportarPage,
  errorComponent: (props) => (
    <AppErrorBoundary {...props} feature="demo-importacion" />
  ),
})

function ClientesImportarPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [files, setFiles] = useState<File[]>([])
  const [drafts, setDrafts] = useState<ImportDraft[]>([])
  const [progress, setProgress] = useState<ImportProgressEvent | null>(null)

  const analyze = useAnalyzeImportFiles()
  const importMutation = useImportDrafts()

  const busy = analyze.isPending || importMutation.isPending

  async function handleAnalyze() {
    if (files.length === 0) {
      toast.error('Agrega al menos un archivo')
      return
    }

    try {
      setDrafts([])
      const result = await analyze.mutateAsync({
        files,
        onProgress: setProgress,
      })
      setDrafts(result)
      toast.success(`Leídos ${result.length} documento(s) — revisa la vista previa`)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'No se pudieron leer los archivos',
      )
    } finally {
      setProgress(null)
    }
  }

  async function handleImport() {
    if (drafts.length === 0) return

    try {
      const results = await importMutation.mutateAsync(drafts)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: clientesKeys.all }),
        queryClient.invalidateQueries({ queryKey: expedientesKeys.all }),
      ])
      toast.success(
        `Demo: 1 cliente y ${results.length} expediente(s) creados en memoria`,
      )
      navigate({ to: '/expedientes' })
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'No se pudo completar la importación',
      )
    }
  }

  function handleLoadDemo() {
    const demoFiles = demoFileNames.map((name, index) => {
      const blob = new Blob([`Demo ${name}`], { type: 'application/octet-stream' })
      return new File([blob], name, {
        type: 'application/octet-stream',
        lastModified: Date.now() + index,
      })
    })
    setFiles(demoFiles)
    setDrafts([])
    toast.message('Archivos demo cargados', {
      description: '5 archivos de ejemplo — puedes agregar más de cualquier tipo.',
    })
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/clientes">
          <ArrowLeft className="size-4" />
          Volver a clientes
        </Link>
      </Button>

      <PageHeader
        title="Importar historial documental"
        description="Demo en memoria: sube varios archivos, simula la lectura y genera un cliente con expedientes por tipo de acto. Sin Supabase ni Storage."
      >
        <Button type="button" variant="outline" onClick={handleLoadDemo} disabled={busy}>
          <Sparkles className="size-4" />
          Cargar demo
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileStack className="size-4" />
            Documentos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUploadZone files={files} onFilesChange={setFiles} disabled={busy} />
          {progress && <ImportProgress event={progress} />}
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={handleAnalyze} disabled={busy || files.length === 0}>
              {analyze.isPending ? 'Leyendo documentos…' : 'Simular lectura'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleImport}
              disabled={busy || drafts.length === 0}
            >
              {importMutation.isPending ? 'Creando expedientes…' : 'Crear expedientes'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {drafts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Vista previa — {drafts[0]?.clienteInput.nombre}</CardTitle>
          </CardHeader>
          <CardContent>
            <ImportPreviewTable drafts={drafts} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
