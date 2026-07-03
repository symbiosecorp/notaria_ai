import { Link } from '@tanstack/react-router'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { Badge } from '#/components/ui/badge'
import { Skeleton } from '#/components/ui/skeleton'
import { EmptyState } from '#/components/common/empty-state'
import { formatDate } from '#/lib/format'
import { estatusExpedienteLabels, tipoActoLabels } from '../schemas'
import type { Expediente, EstatusExpediente } from '../schemas'

export const estatusExpedienteVariant: Record<
  EstatusExpediente,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  abierto: 'secondary',
  en_proceso: 'secondary',
  en_revision: 'outline',
  listo_firma: 'default',
  firmado: 'default',
  inscrito: 'default',
  cerrado: 'outline',
  cancelado: 'destructive',
}

export interface ExpedientesTableProps {
  expedientes: Expediente[]
  isLoading?: boolean
}

export function ExpedientesTable({
  expedientes,
  isLoading,
}: ExpedientesTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (expedientes.length === 0) {
    return (
      <EmptyState
        title="Sin expedientes"
        description="No hay expedientes registrados. Crea el primero con “Nuevo expediente”."
      />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Folio</TableHead>
          <TableHead>Acto</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Responsable</TableHead>
          <TableHead>Estatus</TableHead>
          <TableHead>Fecha límite</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expedientes.map((exp) => (
          <TableRow key={exp.id}>
            <TableCell className="font-mono text-xs font-medium">
              <Link
                to="/expedientes/$expedienteId"
                params={{ expedienteId: exp.id }}
                className="hover:underline"
              >
                {exp.folio}
              </Link>
            </TableCell>
            <TableCell>{tipoActoLabels[exp.tipoActo]}</TableCell>
            <TableCell className="text-muted-foreground">
              {exp.clienteNombre}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {exp.responsable}
            </TableCell>
            <TableCell>
              <Badge variant={estatusExpedienteVariant[exp.estatus]}>
                {estatusExpedienteLabels[exp.estatus]}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(exp.fechaLimite)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
