import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { Plus } from 'lucide-react'
import { Card, CardContent } from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { PageHeader } from '#/components/common/page-header'
import { clientesListOptions, ClientesTable } from '#/features/clientes'

const searchSchema = z.object({
  q: z.string().optional().catch(undefined),
})

export const Route = createFileRoute('/_app/clientes/')({
  component: ClientesPage,
  validateSearch: searchSchema,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(clientesListOptions()),
})

function ClientesPage() {
  const { data } = useSuspenseQuery(clientesListOptions())
  const { q } = Route.useSearch()
  const navigate = Route.useNavigate()
  const search = q ?? ''

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
            onChange={(e) =>
              navigate({
                search: { q: e.target.value || undefined },
                replace: true,
              })
            }
            className="max-w-sm"
          />
          <ClientesTable clientes={filtered} />
        </CardContent>
      </Card>
    </div>
  )
}
