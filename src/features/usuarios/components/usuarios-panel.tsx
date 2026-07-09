import { toast } from 'sonner'
import { ShieldAlert } from 'lucide-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Card, CardContent } from '#/components/ui/card.tsx'
import { Input } from '#/components/ui/input.tsx'
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert.tsx'
import { useAuth } from '#/lib/auth/auth-context'
import { hasPermission } from '#/lib/auth/permissions.ts'
import { isAppError } from '#/lib/errors/app-error'
import {
  usuariosListOptions,
  useDeleteUsuario,
} from '../hooks/use-usuarios.ts'
import { UsuarioFormDialog } from './usuario-form-dialog.tsx'
import { UsuariosTable } from './usuarios-table.tsx'
import { RolesPermisosPanel } from './roles-permisos-panel.tsx'

export interface UsuariosPanelProps {
  search?: string
  onSearchChange?: (value: string) => void
}

export function UsuariosPanel({ search = '', onSearchChange }: UsuariosPanelProps) {
  const { user } = useAuth()
  const { data: usuarios } = useSuspenseQuery(usuariosListOptions())
  const eliminar = useDeleteUsuario()
  const canManage = user ? hasPermission(user.role, 'usuarios:manage') : false

  const term = search.trim().toLowerCase()
  const filtered = term
    ? usuarios.filter(
        (u) =>
          u.nombre.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          u.rol.includes(term),
      )
    : usuarios

  async function handleDelete(id: string) {
    try {
      await eliminar.mutateAsync({ id, currentUserId: user?.id })
      toast.success('Usuario eliminado')
    } catch (error) {
      toast.error(
        isAppError(error) ? error.message : 'No se pudo eliminar el usuario',
      )
    }
  }

  return (
    <div className="space-y-6">
      {!canManage && (
        <Alert>
          <ShieldAlert className="size-4" />
          <AlertTitle>Solo lectura</AlertTitle>
          <AlertDescription>
            Tu rol no incluye permiso para administrar usuarios. Puedes consultar
            la lista y la matriz de permisos; las acciones de alta, edición y
            eliminación están reservadas al administrador.
          </AlertDescription>
        </Alert>
      )}

      <Card className="island-shell">
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              placeholder="Buscar por nombre, correo o rol…"
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="max-w-sm"
              disabled={!onSearchChange}
            />
            {canManage && <UsuarioFormDialog mode="create" />}
          </div>
          <UsuariosTable
            usuarios={filtered}
            canManage={canManage}
            currentUserId={user?.id}
            onDelete={handleDelete}
            deleting={eliminar.isPending}
          />
        </CardContent>
      </Card>

      <RolesPermisosPanel />
    </div>
  )
}
