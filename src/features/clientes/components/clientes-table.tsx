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
import { estatusClienteLabels, tipoPersonaLabels } from '../schemas'
import type { Cliente, EstatusCliente } from '../schemas'

const estatusVariant: Record<
  EstatusCliente,
  'default' | 'secondary' | 'outline'
> = {
  activo: 'default',
  prospecto: 'secondary',
  inactivo: 'outline',
}

export interface ClientesTableProps {
  clientes: Cliente[]
  isLoading?: boolean
}

export function ClientesTable({ clientes, isLoading }: ClientesTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (clientes.length === 0) {
    return (
      <EmptyState
        title="Sin clientes"
        description="No hay clientes registrados aún. Crea el primero con “Nuevo cliente”."
      />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre / Razón social</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>RFC</TableHead>
          <TableHead>Estatus</TableHead>
          <TableHead>Alta</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clientes.map((cliente) => (
          <TableRow key={cliente.id}>
            <TableCell className="font-medium">
              <Link
                to="/clientes/$clienteId"
                params={{ clienteId: cliente.id }}
                className="hover:underline"
              >
                {cliente.nombre}
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {tipoPersonaLabels[cliente.tipoPersona]}
            </TableCell>
            <TableCell className="font-mono text-xs">
              {cliente.rfc || '—'}
            </TableCell>
            <TableCell>
              <Badge variant={estatusVariant[cliente.estatus]}>
                {estatusClienteLabels[cliente.estatus]}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(cliente.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
