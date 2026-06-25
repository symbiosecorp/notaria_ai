import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import { PageHeader } from '#/components/common/page-header'
import { clientesListOptions, ClientesTable } from '#/features/clientes'

export const Route = createFileRoute('/_app/clientes/')({
  component: ClientesPage,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(clientesListOptions()),
})

function ClientesPage() {
  const { data } = useSuspenseQuery(clientesListOptions())

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Listado de clientes de la notaría"
      >
        <Button>Nuevo cliente</Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Clientes registrados</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientesTable clientes={data} />
        </CardContent>
      </Card>
    </div>
  )
}
