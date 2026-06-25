import { createFileRoute } from '@tanstack/react-router'
import { ModulePlaceholder } from '#/components/common/module-placeholder'

export const Route = createFileRoute('/_app/ia')({
  component: IaPage,
})

function IaPage() {
  return (
    <ModulePlaceholder
      title="Asistente IA"
      description="Chat con modelos de lenguaje para redactar, revisar y responder dudas notariales."
    />
  )
}
