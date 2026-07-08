import { MoreHorizontal, KeyRound, Pencil, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table.tsx'
import { Badge } from '#/components/ui/badge.tsx'
import { Button } from '#/components/ui/button.tsx'
import { Avatar, AvatarFallback } from '#/components/ui/avatar.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu.tsx'
import { Skeleton } from '#/components/ui/skeleton.tsx'
import { EmptyState } from '#/components/common/empty-state'
import { ConfirmDialog } from '#/components/common/confirm-dialog'
import { formatDate } from '#/lib/format'
import { CambiarContrasenaDialog } from './cambiar-contrasena-dialog.tsx'
import { UsuarioFormDialog } from './usuario-form-dialog.tsx'
import {
  estatusUsuarioLabels,
  roleLabels,
} from '../schemas.ts'
import type { EstatusUsuario, Usuario, UsuarioRole } from '../schemas.ts'

const roleVariant: Record<
  UsuarioRole,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  admin: 'default',
  notario: 'secondary',
  abogado: 'outline',
  asistente: 'outline',
  contador: 'outline',
  invitado: 'outline',
}

const estatusVariant: Record<
  EstatusUsuario,
  'default' | 'secondary' | 'outline'
> = {
  activo: 'default',
  inactivo: 'outline',
  pendiente: 'secondary',
}

function initials(nombre: string) {
  return nombre
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')
}

export interface UsuariosTableProps {
  usuarios: Usuario[]
  isLoading?: boolean
  canManage?: boolean
  currentUserId?: string
  onDelete: (id: string) => void | Promise<void>
  deleting?: boolean
}

export function UsuariosTable({
  usuarios,
  isLoading,
  canManage,
  currentUserId,
  onDelete,
  deleting,
}: UsuariosTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (usuarios.length === 0) {
    return (
      <EmptyState
        title="Sin usuarios"
        description="No hay cuentas registradas. Crea la primera con “Nuevo usuario”."
      />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuario</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Estatus</TableHead>
          <TableHead>Último acceso</TableHead>
          <TableHead>Alta</TableHead>
          {canManage && <TableHead className="w-12" />}
        </TableRow>
      </TableHeader>
      <TableBody>
        {usuarios.map((usuario) => {
          const isSelf = usuario.id === currentUserId
          return (
            <TableRow key={usuario.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-lagoon/15 text-xs text-lagoon-deep">
                      {initials(usuario.nombre)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {usuario.nombre}
                      {isSelf && (
                        <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                          (tú)
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {usuario.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={roleVariant[usuario.rol]}>
                  {roleLabels[usuario.rol]}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={estatusVariant[usuario.estatus]}>
                  {estatusUsuarioLabels[usuario.estatus]}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(usuario.lastLoginAt)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(usuario.createdAt)}
              </TableCell>
              {canManage && (
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Acciones</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <UsuarioFormDialog
                        mode="edit"
                        usuario={usuario}
                        trigger={
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Pencil className="size-4" />
                            Editar
                          </DropdownMenuItem>
                        }
                      />
                      <CambiarContrasenaDialog
                        usuario={usuario}
                        trigger={
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <KeyRound className="size-4" />
                            Cambiar contraseña
                          </DropdownMenuItem>
                        }
                      />
                      <DropdownMenuSeparator />
                      <ConfirmDialog
                        trigger={
                          <DropdownMenuItem
                            variant="destructive"
                            disabled={isSelf || deleting}
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Trash2 className="size-4" />
                            Eliminar
                          </DropdownMenuItem>
                        }
                        title="Eliminar usuario"
                        description={`¿Eliminar la cuenta de "${usuario.nombre}"? Perderá el acceso al sistema.`}
                        confirmLabel="Eliminar"
                        destructive
                        onConfirm={() => onDelete(usuario.id)}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
