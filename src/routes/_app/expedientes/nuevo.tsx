import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { PageHeader } from '#/components/common/page-header'
import { clientesListOptions } from '#/features/clientes'
import {
  ExpedienteForm,
  useCreateExpediente,
} from '#/features/expedientes'
import type { ExpedienteInput } from '#/features/expedientes'

export const Route = createFileRoute('/_app/expedientes/nuevo')({
  component: NuevoExpedientePage,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(clientesListOptions()),
})

function NuevoExpedientePage() {
  const navigate = useNavigate()
  const { data: clientes } = useSuspenseQuery(clientesListOptions())
  const crear = useCreateExpediente()

  async function handleSubmit(values: ExpedienteInput) {
    try {
      const exp = await crear.mutateAsync(values)
      toast.success('Expediente creado')
      navigate({
        to: '/expedientes/$expedienteId',
        params: { expedienteId: exp.id },
      })
    } catch {
      toast.error('No se pudo crear el expediente')
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
        title="Nuevo expediente"
        description="Abre un nuevo trámite notarial"
      />
      <Card>
        <CardContent className="pt-6">
          <ExpedienteForm
            clientes={clientes.map((c) => ({ id: c.id, nombre: c.nombre }))}
            onSubmit={handleSubmit}
            submitting={crear.isPending}
            submitLabel="Crear expediente"
            onCancel={() => navigate({ to: '/expedientes' })}
          />
        </CardContent>
      </Card>
    </div>
  )
}
