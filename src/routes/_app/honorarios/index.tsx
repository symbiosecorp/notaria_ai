import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { Plus } from 'lucide-react'
import { Card, CardContent } from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { PageHeader } from '#/components/common/page-header'
import {
  cotizacionesListOptions,
  CotizacionesTable,
} from '#/features/honorarios'

const searchSchema = z.object({
  q: z.string().optional().catch(undefined),
})

export const Route = createFileRoute('/_app/honorarios/')({
  component: HonorariosPage,
  validateSearch: searchSchema,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(cotizacionesListOptions()),
})

function HonorariosPage() {
  const { data } = useSuspenseQuery(cotizacionesListOptions())
  const { q } = Route.useSearch()
  const navigate = Route.useNavigate()
  const search = q ?? ''

  const term = search.trim().toLowerCase()
  const filtered = term
    ? data.filter(
        (c) =>
          c.folio.toLowerCase().includes(term) ||
          c.concepto.toLowerCase().includes(term) ||
          (c.clienteNombre ?? '').toLowerCase().includes(term),
      )
    : data

  return (
    <div className="space-y-6">
      <PageHeader
        title="Honorarios"
        description="Cotizaciones basadas en el Arancel Notarial de Puebla"
      >
        <Button asChild>
          <Link to="/honorarios/nueva">
            <Plus className="size-4" />
            Nueva cotización
          </Link>
        </Button>
      </PageHeader>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <Input
            placeholder="Buscar por folio, concepto o cliente…"
            value={search}
            onChange={(e) =>
              navigate({
                search: { q: e.target.value || undefined },
                replace: true,
              })
            }
            className="max-w-sm"
          />
          <CotizacionesTable cotizaciones={filtered} />
        </CardContent>
      </Card>
    </div>
  )
}
