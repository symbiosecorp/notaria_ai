import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { PageHeader } from '#/components/common/page-header'
import { AppErrorBoundary } from '#/lib/errors/error-boundary'
import { formatCurrency, formatDate } from '#/lib/format'
import {
  estatusExpedienteLabels,
  estatusExpedienteVariant,
  expedienteByIdOptions,
  tipoActoLabels,
  useDeleteExpediente,
} from '#/features/expedientes'

export const Route = createFileRoute('/_app/expedientes/$expedienteId')({
  component: ExpedienteDetallePage,
  errorComponent: (props) => (
    <AppErrorBoundary {...props} feature="expedientes" />
  ),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      expedienteByIdOptions(params.expedienteId),
    ),
})

function DetailField({
  label,
  value,
}: {
  label: string
  value?: React.ReactNode
}) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm">{value || '—'}</dd>
    </div>
  )
}

function ExpedienteDetallePage() {
  const { expedienteId } = Route.useParams()
  const navigate = useNavigate()
  const { data: exp } = useSuspenseQuery(expedienteByIdOptions(expedienteId))
  const eliminar = useDeleteExpediente()

  async function handleDelete() {
    if (!window.confirm(`¿Eliminar el expediente ${exp.folio}?`)) return
    try {
      await eliminar.mutateAsync(expedienteId)
      toast.success('Expediente eliminado')
      navigate({ to: '/expedientes' })
    } catch {
      toast.error('No se pudo eliminar el expediente')
    }
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/expedientes">
          <ArrowLeft className="size-4" />
          Volver a expedientes
        </Link>
      </Button>

      <PageHeader
        title={exp.folio}
        description={tipoActoLabels[exp.tipoActo]}
      >
        <Button asChild variant="outline">
          <Link to="/expedientes/$expedienteId/editar" params={{ expedienteId }}>
            <Pencil className="size-4" />
            Editar
          </Link>
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={eliminar.isPending}
        >
          <Trash2 className="size-4" />
          Eliminar
        </Button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Información del expediente</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailField
                label="Estatus"
                value={
                  <Badge variant={estatusExpedienteVariant[exp.estatus]}>
                    {estatusExpedienteLabels[exp.estatus]}
                  </Badge>
                }
              />
              <DetailField label="Cliente" value={exp.clienteNombre} />
              <DetailField label="Responsable" value={exp.responsable} />
              <DetailField
                label="Valor de operación"
                value={
                  exp.valorOperacion != null
                    ? formatCurrency(exp.valorOperacion)
                    : undefined
                }
              />
              <DetailField
                label="Fecha de apertura"
                value={formatDate(exp.fechaApertura)}
              />
              <DetailField
                label="Fecha límite"
                value={formatDate(exp.fechaLimite)}
              />
              <DetailField label="Descripción" value={exp.descripcion} />
              <DetailField label="Notas" value={exp.notas} />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentos pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            {exp.documentosPendientes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Sin documentos pendientes.
              </p>
            ) : (
              <ul className="list-inside list-disc space-y-1 text-sm">
                {exp.documentosPendientes.map((doc) => (
                  <li key={doc}>{doc}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
