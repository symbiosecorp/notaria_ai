import { createFileRoute } from '@tanstack/react-router'
import { ModulePlaceholder } from '#/components/common/module-placeholder'

export const Route = createFileRoute('/_app/honorarios')({
  component: HonorariosPage,
})

function HonorariosPage() {
  return (
    <ModulePlaceholder
      title="Honorarios"
      description="Presupuestos, arancel, pagos, facturación y estado de cuentas de clientes."
    />
  )
}
