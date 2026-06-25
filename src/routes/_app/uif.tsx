import { createFileRoute } from '@tanstack/react-router'
import { ModulePlaceholder } from '#/components/common/module-placeholder'

export const Route = createFileRoute('/_app/uif')({
  component: UifPage,
})

function UifPage() {
  return (
    <ModulePlaceholder
      title="UIF / PLD"
      description="Prevención de lavado de dinero, reportes de operaciones relevantes y bitácora UIF."
    />
  )
}
