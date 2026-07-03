import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table"
import { Skeleton } from "#/components/ui/skeleton"
import { EmptyState } from "./empty-state"

export interface Column<T> {
  key: string
  header: string
  cell: (row: T) => React.ReactNode
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  isLoading?: boolean
  keyExtractor: (row: T) => string
  emptyTitle?: string
  emptyDescription?: string
}

export function DataTable<T>({
  data,
  columns,
  isLoading,
  keyExtractor,
  emptyTitle = "Sin datos",
  emptyDescription = "No hay registros para mostrar.",
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.key}>{col.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={keyExtractor(row)}>
            {columns.map((col) => (
              <TableCell key={`${keyExtractor(row)}-${col.key}`}>
                {col.cell(row)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
