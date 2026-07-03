import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { PageHeader } from '#/components/common/page-header'
import { ConfirmDialog } from '#/components/common/confirm-dialog'
import { AppErrorBoundary } from '#/lib/errors/error-boundary'
import { formatCurrency, formatDate } from '#/lib/format'
import {
  articuloArancelLabels,
  cotizacionByIdOptions,
  estatusCotizacionLabels,
  estatusCotizacionVariant,
  useDeleteCotizacion,
} from '#/features/honorarios'

export const Route = createFileRoute('/_app/honorarios/$cotizacionId')({
  component: CotizacionDetallePage,
  errorComponent: (props) => (
    <AppErrorBoundary {...props} feature="honorarios" />
  ),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      cotizacionByIdOptions(params.cotizacionId),
    ),
})

function Row({
  label,
  value,
  muted,
  strong,
}: {
  label: string
  value: string
  muted?: boolean
  strong?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={muted ? 'text-muted-foreground' : undefined}>
        {label}
      </span>
      <span className={strong ? 'text-lg font-bold text-sea-ink' : 'font-medium'}>
        {value}
      </span>
    </div>
  )
}

function CotizacionDetallePage() {
  const { cotizacionId } = Route.useParams()
  const navigate = useNavigate()
  const { data: cot } = useSuspenseQuery(cotizacionByIdOptions(cotizacionId))
  const eliminar = useDeleteCotizacion()

  async function handleDelete() {
    try {
      await eliminar.mutateAsync(cotizacionId)
      toast.success('Cotización eliminada')
      navigate({ to: '/honorarios' })
    } catch {
      toast.error('No se pudo eliminar la cotización')
    }
  }

  const descuentoMonto = (cot.honorarioBase * cot.descuento) / 100
  const recargoMonto = (cot.honorarioBase * cot.recargo) / 100

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/honorarios">
          <ArrowLeft className="size-4" />
          Volver a honorarios
        </Link>
      </Button>

      <PageHeader title={cot.folio} description={cot.concepto}>
        <Button asChild variant="outline">
          <Link to="/honorarios/$cotizacionId/editar" params={{ cotizacionId }}>
            <Pencil className="size-4" />
            Editar
          </Link>
        </Button>
        <ConfirmDialog
          trigger={
            <Button variant="destructive" disabled={eliminar.isPending}>
              <Trash2 className="size-4" />
              Eliminar
            </Button>
          }
          title="Eliminar cotización"
          description={`¿Eliminar la cotización ${cot.folio}? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          destructive
          onConfirm={handleDelete}
        />
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Datos de la cotización</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-0.5">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Estatus
                </dt>
                <dd>
                  <Badge variant={estatusCotizacionVariant[cot.estatus]}>
                    {estatusCotizacionLabels[cot.estatus]}
                  </Badge>
                </dd>
              </div>
              <div className="space-y-0.5">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Cliente
                </dt>
                <dd className="text-sm">{cot.clienteNombre || '—'}</dd>
              </div>
              <div className="space-y-0.5">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Artículo
                </dt>
                <dd className="text-sm">{articuloArancelLabels[cot.articulo]}</dd>
              </div>
              <div className="space-y-0.5">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Valor de operación
                </dt>
                <dd className="text-sm">{formatCurrency(cot.valorOperacion)}</dd>
              </div>
              <div className="space-y-0.5">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Creada
                </dt>
                <dd className="text-sm">{formatDate(cot.createdAt)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Desglose</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Row label="Honorario base" value={formatCurrency(cot.honorarioBase)} />
            <Row
              label={`Descuento (${cot.descuento}%)`}
              value={formatCurrency(-descuentoMonto)}
              muted
            />
            <Row
              label={`Recargo (${cot.recargo}%)`}
              value={formatCurrency(recargoMonto)}
              muted
            />
            <Row label="Subtotal" value={formatCurrency(cot.subtotal)} />
            <Row label="IVA" value={formatCurrency(cot.iva)} muted />
            <div className="border-t pt-3">
              <Row label="Total" value={formatCurrency(cot.total)} strong />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
