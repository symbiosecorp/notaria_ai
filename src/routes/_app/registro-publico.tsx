import { createFileRoute } from '@tanstack/react-router'
import { ModulePlaceholder } from '#/components/common/module-placeholder'

export const Route = createFileRoute('/_app/registro-publico')({
  component: RegistroPublicoPage,
})

function RegistroPublicoPage() {
  return (
    <ModulePlaceholder
      title="Registro Público"
      description="Consultas y trámites ante el Registro Público de la Propiedad."
    />
  )
}
