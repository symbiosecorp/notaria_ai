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
import { formatDate } from '#/lib/format'
import {
  clienteByIdOptions,
  estadoCivilLabels,
  estatusClienteLabels,
  tipoPersonaLabels,
  useDeleteCliente,
} from '#/features/clientes'
import { ExpedientesTable, expedientesByClienteOptions } from '#/features/expedientes'

export const Route = createFileRoute('/_app/clientes/$clienteId')({
  component: ClienteDetallePage,
  errorComponent: (props) => <AppErrorBoundary {...props} feature="clientes" />,
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(clienteByIdOptions(params.clienteId)),
      context.queryClient.ensureQueryData(
        expedientesByClienteOptions(params.clienteId),
      ),
    ]),
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

function ClienteDetallePage() {
  const { clienteId } = Route.useParams()
  const navigate = useNavigate()
  const { data: cliente } = useSuspenseQuery(clienteByIdOptions(clienteId))
  const { data: expedientesCliente } = useSuspenseQuery(
    expedientesByClienteOptions(clienteId),
  )
  const eliminar = useDeleteCliente()

  async function handleDelete() {
    try {
      await eliminar.mutateAsync(clienteId)
      toast.success('Cliente eliminado')
      navigate({ to: '/clientes' })
    } catch {
      toast.error('No se pudo eliminar el cliente')
    }
  }

  const esFisica = cliente.tipoPersona === 'fisica'

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/clientes">
          <ArrowLeft className="size-4" />
          Volver a clientes
        </Link>
      </Button>

      <PageHeader title={cliente.nombre} description={tipoPersonaLabels[cliente.tipoPersona]}>
        <Button asChild variant="outline">
          <Link to="/clientes/$clienteId/editar" params={{ clienteId }}>
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
          title="Eliminar cliente"
          description={`¿Eliminar al cliente "${cliente.nombre}"? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          destructive
          onConfirm={handleDelete}
        />
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Datos generales</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailField
                label="Estatus"
                value={
                  <Badge variant="secondary">
                    {estatusClienteLabels[cliente.estatus]}
                  </Badge>
                }
              />
              <DetailField label="RFC" value={cliente.rfc} />
              <DetailField label="Correo" value={cliente.email} />
              <DetailField label="Teléfono" value={cliente.telefono} />
              <DetailField label="Domicilio" value={cliente.domicilio} />
              {esFisica ? (
                <>
                  <DetailField label="CURP" value={cliente.curp} />
                  <DetailField label="Nacionalidad" value={cliente.nacionalidad} />
                  <DetailField
                    label="Estado civil"
                    value={
                      cliente.estadoCivil
                        ? estadoCivilLabels[cliente.estadoCivil]
                        : undefined
                    }
                  />
                </>
              ) : (
                <DetailField
                  label="Representante legal"
                  value={cliente.representanteLegal}
                />
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cumplimiento y control</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4">
              <DetailField
                label="Beneficiario controlador"
                value={cliente.beneficiarioControlador}
              />
              <DetailField
                label="Actividad vulnerable"
                value={cliente.esActividadVulnerable ? 'Sí' : 'No'}
              />
              <DetailField label="Alta" value={formatDate(cliente.createdAt)} />
              <DetailField
                label="Última actualización"
                value={formatDate(cliente.updatedAt)}
              />
              <DetailField label="Notas" value={cliente.notas} />
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expedientes del cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpedientesTable expedientes={expedientesCliente} />
        </CardContent>
      </Card>
    </div>
  )
}
