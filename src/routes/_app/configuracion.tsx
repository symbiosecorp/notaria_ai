import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { PageHeader } from '#/components/common/page-header'
import { ModulePlaceholder } from '#/components/common/module-placeholder'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs.tsx'
import { AppErrorBoundary } from '#/lib/errors/error-boundary'
import { requirePermission } from '#/lib/auth/guard.ts'
import { usuariosListOptions, UsuariosPanel } from '#/features/usuarios'

const searchSchema = z.object({
  tab: z
    .enum(['usuarios', 'bitacora', 'general'])
    .optional()
    .catch(undefined),
  q: z.string().optional().catch(undefined),
})

export const Route = createFileRoute('/_app/configuracion')({
  component: ConfiguracionPage,
  validateSearch: searchSchema,
  errorComponent: (props) => (
    <AppErrorBoundary {...props} feature="configuracion" />
  ),
  beforeLoad: ({ context }) => {
    requirePermission(context.user, 'configuracion:view')
  },
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(usuariosListOptions()),
})

function ConfiguracionPage() {
  useSuspenseQuery(usuariosListOptions())
  const { tab, q } = Route.useSearch()
  const navigate = Route.useNavigate()
  const activeTab = tab ?? 'usuarios'
  const search = q ?? ''

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuración"
        description="Usuarios, roles, permisos, bitácora de seguridad y ajustes generales del sistema."
      />

      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          navigate({
            search: (prev) => ({
              ...prev,
              tab: value as 'usuarios' | 'bitacora' | 'general',
            }),
            replace: true,
          })
        }
      >
        <TabsList>
          <TabsTrigger value="usuarios">Usuarios y roles</TabsTrigger>
          <TabsTrigger value="bitacora">Bitácora</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="mt-6">
          <UsuariosPanel
            search={search}
            onSearchChange={(value) =>
              navigate({
                search: (prev) => ({
                  ...prev,
                  q: value || undefined,
                }),
                replace: true,
              })
            }
          />
        </TabsContent>

        <TabsContent value="bitacora" className="mt-6">
          <ModulePlaceholder
            title="Bitácora de seguridad"
            description="Registro de actividad, cambios y auditoría del sistema (requerido por el RFP). Disponible en una entrega posterior con backend."
          />
        </TabsContent>

        <TabsContent value="general" className="mt-6">
          <ModulePlaceholder
            title="Ajustes generales"
            description="Parámetros del sistema: UMA, datos de la notaría, respaldos y preferencias globales."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
