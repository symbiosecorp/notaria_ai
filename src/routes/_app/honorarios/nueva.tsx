import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { PageHeader } from '#/components/common/page-header'
import { clientesListOptions } from '#/features/clientes'
import { CotizacionForm, useCreateCotizacion } from '#/features/honorarios'
import type { CotizacionInput } from '#/features/honorarios'

export const Route = createFileRoute('/_app/honorarios/nueva')({
  component: NuevaCotizacionPage,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(clientesListOptions()),
})

function NuevaCotizacionPage() {
  const navigate = useNavigate()
  const { data: clientes } = useSuspenseQuery(clientesListOptions())
  const crear = useCreateCotizacion()

  async function handleSubmit(values: CotizacionInput) {
    try {
      const cot = await crear.mutateAsync(values)
      toast.success('Cotización creada')
      navigate({
        to: '/honorarios/$cotizacionId',
        params: { cotizacionId: cot.id },
      })
    } catch {
      toast.error('No se pudo crear la cotización')
    }
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/honorarios">
          <ArrowLeft className="size-4" />
          Volver a honorarios
        </Link>
      </Button>
      <PageHeader
        title="Nueva cotización"
        description="Calcula honorarios según el arancel"
      />
      <Card>
        <CardContent className="pt-6">
          <CotizacionForm
            clientes={clientes.map((c) => ({ id: c.id, nombre: c.nombre }))}
            onSubmit={handleSubmit}
            submitting={crear.isPending}
            submitLabel="Crear cotización"
            onCancel={() => navigate({ to: '/honorarios' })}
          />
        </CardContent>
      </Card>
    </div>
  )
}
