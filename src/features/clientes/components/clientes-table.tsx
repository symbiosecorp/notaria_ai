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
import type { Cliente } from '../schemas'

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
    return <EmptyState title="Sin clientes" description="No hay clientes registrados aún." />
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>CURP</TableHead>
          <TableHead>Alta</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clientes.map((cliente) => (
          <TableRow key={cliente.id}>
            <TableCell className="font-medium">{cliente.nombre}</TableCell>
            <TableCell>{cliente.email}</TableCell>
            <TableCell>{cliente.telefono}</TableCell>
            <TableCell>
              <Badge variant="outline">{cliente.curp || '—'}</Badge>
            </TableCell>
            <TableCell>
              {new Date(cliente.createdAt).toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
