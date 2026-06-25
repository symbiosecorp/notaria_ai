import { createFileRoute } from '@tanstack/react-router'
import { ModulePlaceholder } from '#/components/common/module-placeholder'

export const Route = createFileRoute('/_app/fiscal')({
  component: FiscalPage,
})

function FiscalPage() {
  return (
    <ModulePlaceholder
      title="Fiscal"
      description="Declaraciones, retenciones, facturación CFDI y reportes ante el SAT."
    />
  )
}
