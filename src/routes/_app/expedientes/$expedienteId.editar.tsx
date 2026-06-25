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
  ExpedienteForm,
  expedienteByIdOptions,
  useUpdateExpediente,
} from '#/features/expedientes'
import type { ExpedienteInput } from '#/features/expedientes'

export const Route = createFileRoute('/_app/expedientes/$expedienteId/editar')({
  component: EditarExpedientePage,
  errorComponent: (props) => (
    <AppErrorBoundary {...props} feature="expedientes" />
  ),
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(
        expedienteByIdOptions(params.expedienteId),
      ),
      context.queryClient.ensureQueryData(clientesListOptions()),
    ]),
})

function EditarExpedientePage() {
  const { expedienteId } = Route.useParams()
  const navigate = useNavigate()
  const { data: exp } = useSuspenseQuery(expedienteByIdOptions(expedienteId))
  const { data: clientes } = useSuspenseQuery(clientesListOptions())
  const actualizar = useUpdateExpediente(expedienteId)

  async function handleSubmit(values: ExpedienteInput) {
    try {
      await actualizar.mutateAsync(values)
      toast.success('Expediente actualizado')
      navigate({
        to: '/expedientes/$expedienteId',
        params: { expedienteId },
      })
    } catch {
      toast.error('No se pudo actualizar el expediente')
    }
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/expedientes/$expedienteId" params={{ expedienteId }}>
          <ArrowLeft className="size-4" />
          Volver al expediente
        </Link>
      </Button>
      <PageHeader title="Editar expediente" description={exp.folio} />
      <Card>
        <CardContent className="pt-6">
          <ExpedienteForm
            clientes={clientes.map((c) => ({ id: c.id, nombre: c.nombre }))}
            defaultValues={{
              tipoActo: exp.tipoActo,
              descripcion: exp.descripcion ?? '',
              clienteId: exp.clienteId,
              clienteNombre: exp.clienteNombre,
              responsable: exp.responsable,
              estatus: exp.estatus,
              fechaLimite: exp.fechaLimite,
              documentosPendientes: exp.documentosPendientes,
              valorOperacion: exp.valorOperacion,
              notas: exp.notas ?? '',
            }}
            onSubmit={handleSubmit}
            submitting={actualizar.isPending}
            submitLabel="Guardar cambios"
            onCancel={() =>
              navigate({
                to: '/expedientes/$expedienteId',
                params: { expedienteId },
              })
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}
