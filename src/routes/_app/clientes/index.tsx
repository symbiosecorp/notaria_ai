import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { FileUp, Plus } from 'lucide-react'
import { Card, CardContent } from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { PageHeader } from '#/components/common/page-header'
import { clientesListOptions, ClientesTable } from '#/features/clientes'

export const Route = createFileRoute('/_app/clientes/')({
  component: ClientesPage,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(clientesListOptions()),
})

function ClientesPage() {
  const { data } = useSuspenseQuery(clientesListOptions())
  const [search, setSearch] = useState('')

  const term = search.trim().toLowerCase()
  const filtered = term
    ? data.filter(
        (c) =>
          c.nombre.toLowerCase().includes(term) ||
          (c.rfc ?? '').toLowerCase().includes(term),
      )
    : data

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Personas físicas y morales registradas en la notaría"
      >
        <Button asChild variant="outline">
          <Link to="/clientes/importar">
            <FileUp className="size-4" />
            Importar historial
          </Link>
        </Button>
        <Button asChild>
          <Link to="/clientes/nuevo">
            <Plus className="size-4" />
            Nuevo cliente
          </Link>
        </Button>
      </PageHeader>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <Input
            placeholder="Buscar por nombre o RFC…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <ClientesTable clientes={filtered} />
        </CardContent>
      </Card>
    </div>
  )
}
