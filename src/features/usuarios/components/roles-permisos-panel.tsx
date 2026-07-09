import { Check, X } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card.tsx'
import { Badge } from '#/components/ui/badge.tsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table.tsx'
import {
  PERMISSIONS,
  ROLES,
} from '#/lib/auth/permissions.ts'
import type { Permission, Role } from '#/lib/auth/permissions.ts'
import { roleLabels } from '../schemas.ts'

const permissionLabels: Record<Permission, string> = {
  'dashboard:view': 'Ver dashboard',
  'clientes:view': 'Ver clientes',
  'clientes:create': 'Crear clientes',
  'clientes:edit': 'Editar clientes',
  'clientes:delete': 'Eliminar clientes',
  'expedientes:view': 'Ver expedientes',
  'expedientes:create': 'Crear expedientes',
  'expedientes:edit': 'Editar expedientes',
  'expedientes:delete': 'Eliminar expedientes',
  'honorarios:view': 'Ver honorarios',
  'honorarios:edit': 'Editar honorarios',
  'documental:view': 'Ver documental',
  'documental:upload': 'Subir documentos',
  'documental:delete': 'Eliminar documentos',
  'registro_publico:view': 'Ver registro público',
  'fiscal:view': 'Ver fiscal',
  'uif:view': 'Ver UIF / PLD',
  'agenda:view': 'Ver agenda',
  'agenda:edit': 'Editar agenda',
  'reportes:view': 'Ver reportes',
  'ia:view': 'Usar asistente IA',
  'configuracion:view': 'Ver configuración',
  'usuarios:manage': 'Administrar usuarios',
  'roles:manage': 'Administrar roles',
  'bitacora:view': 'Ver bitácora',
}

const permissionGroups: { label: string; keys: Permission[] }[] = [
  {
    label: 'Operaciones',
    keys: [
      'dashboard:view',
      'clientes:view',
      'clientes:create',
      'clientes:edit',
      'clientes:delete',
      'expedientes:view',
      'expedientes:create',
      'expedientes:edit',
      'expedientes:delete',
      'honorarios:view',
      'honorarios:edit',
      'documental:view',
      'documental:upload',
      'documental:delete',
      'agenda:view',
      'agenda:edit',
    ],
  },
  {
    label: 'Gobierno y cumplimiento',
    keys: ['registro_publico:view', 'fiscal:view', 'uif:view'],
  },
  {
    label: 'Inteligencia',
    keys: ['reportes:view', 'ia:view'],
  },
  {
    label: 'Administración',
    keys: [
      'configuracion:view',
      'usuarios:manage',
      'roles:manage',
      'bitacora:view',
    ],
  },
]

const displayRoles: Role[] = [
  ROLES.ADMIN,
  ROLES.NOTARIO,
  ROLES.ABOGADO,
  ROLES.ASISTENTE,
  ROLES.CONTADOR,
]

function PermissionCell({ allowed }: { allowed: boolean }) {
  return allowed ? (
    <Check className="mx-auto size-4 text-lagoon-deep" aria-label="Permitido" />
  ) : (
    <X className="mx-auto size-4 text-muted-foreground/40" aria-label="Denegado" />
  )
}

export function RolesPermisosPanel() {
  return (
    <Card className="island-shell">
      <CardHeader>
        <CardTitle>Roles y permisos</CardTitle>
        <CardDescription>
          Matriz de acceso por rol según la política de seguridad del RFP (usuarios,
          roles, permisos y bitácora). Solo el administrador puede modificar cuentas;
          los demás roles tienen permisos fijos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex flex-wrap gap-2">
          {displayRoles.map((rol) => (
            <Badge key={rol} variant="outline">
              {roleLabels[rol]}
            </Badge>
          ))}
        </div>

        {permissionGroups.map((group) => (
          <div key={group.label} className="space-y-3">
            <h3 className="text-sm font-semibold text-sea-ink">{group.label}</h3>
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-48">Permiso</TableHead>
                    {displayRoles.map((rol) => (
                      <TableHead key={rol} className="w-24 text-center">
                        {roleLabels[rol]}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.keys.map((permission) => (
                    <TableRow key={permission}>
                      <TableCell className="text-sm">
                        {permissionLabels[permission]}
                      </TableCell>
                      {displayRoles.map((rol) => (
                        <TableCell key={rol} className="text-center">
                          <PermissionCell
                            allowed={(PERMISSIONS[permission] as readonly string[]).includes(
                              rol,
                            )}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
