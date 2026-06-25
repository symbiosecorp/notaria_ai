import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '#/components/common/page-header'
import { ModulePlaceholder } from '#/components/common/module-placeholder'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { modules } from '#/lib/config/modules'

export const Route = createFileRoute('/_app/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Resumen general de la notaría"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.slice(0, 6).map((module) => (
          <Card key={module.id}>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
              <div className="flex size-10 items-center justify-center rounded-md bg-lagoon/15 text-lagoon-deep">
                <module.icon className="size-5" />
              </div>
              <CardTitle className="text-base font-medium">{module.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Módulo disponible</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <ModulePlaceholder
        title="Bienvenido a NOTARIA IA"
        description="Este es el esqueleto navegable del sistema. Usa el sidebar para explorar los módulos."
      />
    </div>
  )
}
