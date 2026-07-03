import { createFileRoute } from '@tanstack/react-router'
import { ModulePlaceholder } from '#/components/common/module-placeholder'

export const Route = createFileRoute('/_app/documental')({
  component: DocumentalPage,
})

function DocumentalPage() {
  return (
    <ModulePlaceholder
      title="Gestión Documental"
      description="Almacenamiento, versionado y firma de documentos notariales."
    />
  )
}
