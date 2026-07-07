import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { Badge } from '#/components/ui/badge'
import { tipoActoLabels } from '#/features/expedientes'
import type { ImportDraft } from '#/lib/api/demo-importacion/schemas.ts'

export interface ImportPreviewTableProps {
  drafts: ImportDraft[]
}

export function ImportPreviewTable({ drafts }: ImportPreviewTableProps) {
  if (drafts.length === 0) return null

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Archivo</TableHead>
            <TableHead>Tipo de acto</TableHead>
            <TableHead>Cliente inferido</TableHead>
            <TableHead>Responsable</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drafts.map((draft) => (
            <TableRow key={draft.localId}>
              <TableCell className="max-w-[220px] truncate font-medium">
                {draft.fileName}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {tipoActoLabels[draft.tipoActo]}
                </Badge>
              </TableCell>
              <TableCell>{draft.clienteInput.nombre}</TableCell>
              <TableCell className="text-muted-foreground">
                {draft.expedienteInput.responsable}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
