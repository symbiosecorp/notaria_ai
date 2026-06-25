import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { PageHeader } from '#/components/common/page-header'
import { AppErrorBoundary } from '#/lib/errors/error-boundary'
import {
  ClienteForm,
  clienteByIdOptions,
  useUpdateCliente,
} from '#/features/clientes'
import type { ClienteInput } from '#/features/clientes'

export const Route = createFileRoute('/_app/clientes/$clienteId/editar')({
  component: EditarClientePage,
  errorComponent: (props) => <AppErrorBoundary {...props} feature="clientes" />,
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(clienteByIdOptions(params.clienteId)),
})

function EditarClientePage() {
  const { clienteId } = Route.useParams()
  const navigate = useNavigate()
  const { data: cliente } = useSuspenseQuery(clienteByIdOptions(clienteId))
  const actualizar = useUpdateCliente(clienteId)

  const { id: _id, createdAt: _c, updatedAt: _u, ...defaultValues } = cliente

  async function handleSubmit(values: ClienteInput) {
    try {
      await actualizar.mutateAsync(values)
      toast.success('Cliente actualizado')
      navigate({ to: '/clientes/$clienteId', params: { clienteId } })
    } catch {
      toast.error('No se pudo actualizar el cliente')
    }
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/clientes/$clienteId" params={{ clienteId }}>
          <ArrowLeft className="size-4" />
          Volver al cliente
        </Link>
      </Button>
      <PageHeader title="Editar cliente" description={cliente.nombre} />
      <Card>
        <CardContent className="pt-6">
          <ClienteForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            submitting={actualizar.isPending}
            submitLabel="Guardar cambios"
            onCancel={() =>
              navigate({ to: '/clientes/$clienteId', params: { clienteId } })
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}
