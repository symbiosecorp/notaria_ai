import { createFileRoute } from '@tanstack/react-router'
import { ModulePlaceholder } from '#/components/common/module-placeholder'

export const Route = createFileRoute('/_app/expedientes')({
  component: ExpedientesPage,
})

function ExpedientesPage() {
  return (
    <ModulePlaceholder
      title="Expedientes"
      description="Gestión de expedientes notariales: trámites, seguimiento, estados y responsables."
    />
  )
}
