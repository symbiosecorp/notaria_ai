import { createFileRoute } from '@tanstack/react-router'
import { ModulePlaceholder } from '#/components/common/module-placeholder'

export const Route = createFileRoute('/_app/configuracion')({
  component: ConfiguracionPage,
})

function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <ModulePlaceholder
        title="Configuración"
        description="Usuarios, roles, permisos, bitácora de seguridad y ajustes generales del sistema."
      />
      <ModulePlaceholder
        title="Usuarios y roles"
        description="Administración de cuentas y asignación de permisos."
      />
      <ModulePlaceholder
        title="Bitácora"
        description="Registro de actividad y auditoría del sistema."
      />
    </div>
  )
}
