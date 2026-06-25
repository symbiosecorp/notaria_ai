import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { PageHeader } from '#/components/common/page-header'
import { AppErrorBoundary } from '#/lib/errors/error-boundary'
import { clientesListOptions } from '#/features/clientes'
import {
  CotizacionForm,
  cotizacionByIdOptions,
  useUpdateCotizacion,
} from '#/features/honorarios'
import type { CotizacionInput } from '#/features/honorarios'

export const Route = createFileRoute('/_app/honorarios/$cotizacionId/editar')({
  component: EditarCotizacionPage,
  errorComponent: (props) => (
    <AppErrorBoundary {...props} feature="honorarios" />
  ),
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(
        cotizacionByIdOptions(params.cotizacionId),
      ),
      context.queryClient.ensureQueryData(clientesListOptions()),
    ]),
})

function EditarCotizacionPage() {
  const { cotizacionId } = Route.useParams()
  const navigate = useNavigate()
  const { data: cot } = useSuspenseQuery(cotizacionByIdOptions(cotizacionId))
  const { data: clientes } = useSuspenseQuery(clientesListOptions())
  const actualizar = useUpdateCotizacion(cotizacionId)

  async function handleSubmit(values: CotizacionInput) {
    try {
      await actualizar.mutateAsync(values)
      toast.success('Cotización actualizada')
      navigate({
        to: '/honorarios/$cotizacionId',
        params: { cotizacionId },
      })
    } catch {
      toast.error('No se pudo actualizar la cotización')
    }
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/honorarios/$cotizacionId" params={{ cotizacionId }}>
          <ArrowLeft className="size-4" />
          Volver a la cotización
        </Link>
      </Button>
      <PageHeader title="Editar cotización" description={cot.folio} />
      <Card>
        <CardContent className="pt-6">
          <CotizacionForm
            clientes={clientes.map((c) => ({ id: c.id, nombre: c.nombre }))}
            defaultValues={{
              concepto: cot.concepto,
              clienteId: cot.clienteId ?? '',
              clienteNombre: cot.clienteNombre ?? '',
              articulo: cot.articulo,
              valorOperacion: cot.valorOperacion,
              descuento: cot.descuento,
              recargo: cot.recargo,
              estatus: cot.estatus,
            }}
            onSubmit={handleSubmit}
            submitting={actualizar.isPending}
            submitLabel="Guardar cambios"
            onCancel={() =>
              navigate({
                to: '/honorarios/$cotizacionId',
                params: { cotizacionId },
              })
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}
