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
import { formatCurrency } from '#/lib/format'
import {
  articuloArancelLabels,
  estatusCotizacionLabels,
  type Cotizacion,
  type EstatusCotizacion,
} from '../schemas'

export const estatusCotizacionVariant: Record<
  EstatusCotizacion,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  borrador: 'secondary',
  enviada: 'outline',
  aceptada: 'default',
  rechazada: 'destructive',
}

export interface CotizacionesTableProps {
  cotizaciones: Cotizacion[]
  isLoading?: boolean
}

export function CotizacionesTable({
  cotizaciones,
  isLoading,
}: CotizacionesTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (cotizaciones.length === 0) {
    return (
      <EmptyState
        title="Sin cotizaciones"
        description="No hay cotizaciones registradas. Crea la primera con “Nueva cotización”."
      />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Folio</TableHead>
          <TableHead>Concepto</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Artículo</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead>Estatus</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cotizaciones.map((cot) => (
          <TableRow key={cot.id}>
            <TableCell className="font-mono text-xs font-medium">
              <Link
                to="/honorarios/$cotizacionId"
                params={{ cotizacionId: cot.id }}
                className="hover:underline"
              >
                {cot.folio}
              </Link>
            </TableCell>
            <TableCell>{cot.concepto}</TableCell>
            <TableCell className="text-muted-foreground">
              {cot.clienteNombre || '—'}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {articuloArancelLabels[cot.articulo]}
            </TableCell>
            <TableCell className="text-right font-medium">
              {formatCurrency(cot.total)}
            </TableCell>
            <TableCell>
              <Badge variant={estatusCotizacionVariant[cot.estatus]}>
                {estatusCotizacionLabels[cot.estatus]}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
