import { createFileRoute } from '@tanstack/react-router'
import { ModulePlaceholder } from '#/components/common/module-placeholder'

export const Route = createFileRoute('/_app/agenda')({
  component: AgendaPage,
})

function AgendaPage() {
  return (
    <ModulePlaceholder
      title="Agenda"
      description="Calendario de citas, vencimientos, recordatorios y disponibilidad de personal."
    />
  )
}
