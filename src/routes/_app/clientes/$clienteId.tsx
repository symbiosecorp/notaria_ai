import { createFileRoute } from '@tanstack/react-router'
import { ModulePlaceholder } from '#/components/common/module-placeholder'

export const Route = createFileRoute('/_app/clientes/$clienteId')({
  component: ClienteDetallePage,
})

function ClienteDetallePage() {
  const { clienteId } = Route.useParams()
  return (
    <ModulePlaceholder
      title={`Detalle del cliente ${clienteId}`}
      description="Aquí se mostrará el perfil completo, documentos y expedientes vinculados al cliente."
    />
  )
}
