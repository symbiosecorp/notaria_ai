import { importStepLabels } from '#/lib/api/demo-importacion/schemas.ts'
import type { ImportProgressEvent } from '#/lib/api/demo-importacion/demo-importacion.service.ts'

export interface ImportProgressProps {
  event: ImportProgressEvent | null
}

export function ImportProgress({ event }: ImportProgressProps) {
  if (!event) return null

  return (
    <div className="space-y-2 rounded-lg border bg-muted/20 p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-sea-ink">
          {importStepLabels[event.step]}
        </span>
        <span className="text-muted-foreground">{Math.round(event.progress)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-lagoon transition-all duration-300"
          style={{ width: `${Math.min(event.progress, 100)}%` }}
        />
      </div>
      {event.fileName && (
        <p className="truncate text-xs text-muted-foreground">
          Archivo {event.fileIndex} de {event.totalFiles}: {event.fileName}
        </p>
      )}
    </div>
  )
}
