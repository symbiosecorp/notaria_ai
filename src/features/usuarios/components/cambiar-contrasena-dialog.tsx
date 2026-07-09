import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { KeyRound } from 'lucide-react'
import { Button } from '#/components/ui/button.tsx'
import { Input } from '#/components/ui/input.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog.tsx'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field.tsx'
import { toFieldErrors } from '#/lib/forms'
import { isAppError } from '#/lib/errors/app-error'
import { useChangeUsuarioPassword } from '../hooks/use-usuarios.ts'
import { cambiarContrasenaInputSchema } from '../schemas.ts'
import type { Usuario } from '../schemas.ts'

export interface CambiarContrasenaDialogProps {
  usuario: Usuario
  trigger?: React.ReactNode
}

export function CambiarContrasenaDialog({
  usuario,
  trigger,
}: CambiarContrasenaDialogProps) {
  const [open, setOpen] = useState(false)
  const cambiar = useChangeUsuarioPassword(usuario.id)

  const form = useForm({
    defaultValues: { password: '', confirmPassword: '' },
    validators: { onSubmit: cambiarContrasenaInputSchema },
    onSubmit: async ({ value }) => {
      try {
        await cambiar.mutateAsync(cambiarContrasenaInputSchema.parse(value))
        toast.success('Contraseña actualizada')
        setOpen(false)
        form.reset()
      } catch (error) {
        toast.error(
          isAppError(error) ? error.message : 'No se pudo cambiar la contraseña',
        )
      }
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            <KeyRound className="size-4" />
            Cambiar contraseña
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar contraseña</DialogTitle>
          <DialogDescription>
            Establece una nueva contraseña para{' '}
            <span className="font-medium text-foreground">{usuario.nombre}</span>{' '}
            ({usuario.email}).
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field name="password">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="password">Nueva contraseña</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                </Field>
              )}
            </form.Field>
            <form.Field name="confirmPassword">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirmar contraseña
                  </FieldLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                </Field>
              )}
            </form.Field>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={cambiar.isPending}>
                {cambiar.isPending ? 'Guardando…' : 'Actualizar contraseña'}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
