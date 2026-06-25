import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { PageHeader } from '#/components/common/page-header'
import { ClienteForm, useCreateCliente } from '#/features/clientes'
import type { ClienteInput } from '#/features/clientes'

export const Route = createFileRoute('/_app/clientes/nuevo')({
  component: NuevoClientePage,
})

function NuevoClientePage() {
  const navigate = useNavigate()
  const crear = useCreateCliente()

  async function handleSubmit(values: ClienteInput) {
    try {
      const cliente = await crear.mutateAsync(values)
      toast.success('Cliente creado')
      navigate({ to: '/clientes/$clienteId', params: { clienteId: cliente.id } })
    } catch {
      toast.error('No se pudo crear el cliente')
    }
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/clientes">
          <ArrowLeft className="size-4" />
          Volver a clientes
        </Link>
      </Button>
      <PageHeader
        title="Nuevo cliente"
        description="Registra una persona física o moral"
      />
      <Card>
        <CardContent className="pt-6">
          <ClienteForm
            onSubmit={handleSubmit}
            submitting={crear.isPending}
            submitLabel="Crear cliente"
            onCancel={() => navigate({ to: '/clientes' })}
          />
        </CardContent>
      </Card>
    </div>
  )
}
