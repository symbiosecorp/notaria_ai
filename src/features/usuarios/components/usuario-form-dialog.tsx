import { useState } from 'react'
import { toast } from 'sonner'
import { Pencil, Plus, UserPlus } from 'lucide-react'
import { Button } from '#/components/ui/button.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog.tsx'
import { isAppError } from '#/lib/errors/app-error'
import { UsuarioForm } from './usuario-form.tsx'
import { useCreateUsuario, useUpdateUsuario } from '../hooks/use-usuarios.ts'
import type { CreateUsuarioInput, Usuario, UsuarioInput } from '../schemas.ts'

export interface UsuarioFormDialogProps {
  mode: 'create' | 'edit'
  usuario?: Usuario
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function UsuarioFormDialog({
  mode,
  usuario,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: UsuarioFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  const crear = useCreateUsuario()
  const actualizar = useUpdateUsuario(usuario?.id ?? '')
  const isCreate = mode === 'create'
  const pending = isCreate ? crear.isPending : actualizar.isPending

  async function handleSubmit(values: CreateUsuarioInput | UsuarioInput) {
    try {
      if (isCreate) {
        await crear.mutateAsync(values as CreateUsuarioInput)
        toast.success('Usuario creado')
      } else if (usuario) {
        await actualizar.mutateAsync(values)
        toast.success('Usuario actualizado')
      }
      setOpen(false)
    } catch (error) {
      toast.error(
        isAppError(error)
          ? error.message
          : isCreate
            ? 'No se pudo crear el usuario'
            : 'No se pudo actualizar el usuario',
      )
    }
  }

  const defaultTrigger = isCreate ? (
    <Button>
      <Plus className="size-4" />
      Nuevo usuario
    </Button>
  ) : (
    <Button variant="ghost" size="sm">
      <Pencil className="size-4" />
      Editar
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger !== undefined ? (
        trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>{defaultTrigger}</DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isCreate ? (
              <>
                <UserPlus className="size-5 text-lagoon-deep" />
                Nuevo usuario
              </>
            ) : (
              'Editar usuario'
            )}
          </DialogTitle>
          <DialogDescription>
            {isCreate
              ? 'Da de alta una cuenta con correo, rol y contraseña inicial.'
              : 'Modifica el nombre, correo, rol o estatus del usuario.'}
          </DialogDescription>
        </DialogHeader>
        <UsuarioForm
          mode={mode}
          defaultValues={usuario}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          submitting={pending}
        />
      </DialogContent>
    </Dialog>
  )
}
