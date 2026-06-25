import { createFileRoute } from '@tanstack/react-router'
import { ModulePlaceholder } from '#/components/common/module-placeholder'

export const Route = createFileRoute('/_app/reportes')({
  component: ReportesPage,
})

function ReportesPage() {
  return (
    <ModulePlaceholder
      title="Reportes"
      description="KPIs, indicadores de productividad, históricos y reportes exportables."
    />
  )
}
