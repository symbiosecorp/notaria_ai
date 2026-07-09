import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { Plus } from 'lucide-react'
import { Card, CardContent } from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { PageHeader } from '#/components/common/page-header'
import { expedientesListOptions, ExpedientesTable } from '#/features/expedientes'

const searchSchema = z.object({
  q: z.string().optional().catch(undefined),
})

export const Route = createFileRoute('/_app/expedientes/')({
  component: ExpedientesPage,
  validateSearch: searchSchema,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(expedientesListOptions()),
})

function ExpedientesPage() {
  const { data } = useSuspenseQuery(expedientesListOptions())
  const { q } = Route.useSearch()
  const navigate = Route.useNavigate()
  const search = q ?? ''

  const term = search.trim().toLowerCase()
  const filtered = term
    ? data.filter(
        (e) =>
          e.folio.toLowerCase().includes(term) ||
          e.clienteNombre.toLowerCase().includes(term) ||
          e.responsable.toLowerCase().includes(term),
      )
    : data

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expedientes"
        description="Trámites y actos notariales en proceso"
      >
        <Button asChild>
          <Link to="/expedientes/nuevo">
            <Plus className="size-4" />
            Nuevo expediente
          </Link>
        </Button>
      </PageHeader>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <Input
            placeholder="Buscar por folio, cliente o responsable…"
            value={search}
            onChange={(e) =>
              navigate({
                search: { q: e.target.value || undefined },
                replace: true,
              })
            }
            className="max-w-sm"
          />
          <ExpedientesTable expedientes={filtered} />
        </CardContent>
      </Card>
    </div>
  )
}
