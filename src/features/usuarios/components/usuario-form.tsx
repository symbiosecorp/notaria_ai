import { useForm } from '@tanstack/react-form'
import { Button } from '#/components/ui/button.tsx'
import { Input } from '#/components/ui/input.tsx'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select.tsx'
import { toFieldErrors } from '#/lib/forms'
import {
  assignableRoles,
  createUsuarioInputSchema,
  estatusUsuarioEnum,
  estatusUsuarioLabels,
  roleLabels,
  usuarioInputSchema,
} from '../schemas.ts'
import type { CreateUsuarioInput, UsuarioInput } from '../schemas.ts'

const emptyCreateValues: CreateUsuarioInput = {
  email: '',
  nombre: '',
  rol: 'asistente',
  estatus: 'activo',
  password: '',
}

const emptyEditValues: UsuarioInput = {
  email: '',
  nombre: '',
  rol: 'asistente',
  estatus: 'activo',
}

export interface UsuarioFormProps {
  mode: 'create' | 'edit'
  defaultValues?: Partial<UsuarioInput>
  onSubmit: (values: CreateUsuarioInput | UsuarioInput) => void | Promise<void>
  onCancel?: () => void
  submitting?: boolean
  submitLabel?: string
}

function FormActions({
  onCancel,
  submitting,
  submitLabel,
}: {
  onCancel?: () => void
  submitting?: boolean
  submitLabel: string
}) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      )}
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Guardando…' : submitLabel}
      </Button>
    </div>
  )
}

function UsuarioCreateForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitting,
  submitLabel,
}: Omit<UsuarioFormProps, 'mode'>) {
  const form = useForm({
    defaultValues: { ...emptyCreateValues, ...defaultValues },
    validators: { onSubmit: createUsuarioInputSchema },
    onSubmit: async ({ value }) => {
      await onSubmit(createUsuarioInputSchema.parse(value))
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="nombre">
            {(field) => (
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="nombre">Nombre completo</FieldLabel>
                <Input
                  id="nombre"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Ej. Lic. María García López"
                />
                <FieldError errors={toFieldErrors(field.state.meta.errors)} />
              </Field>
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="off"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="usuario@notaria.example"
                />
                <FieldError errors={toFieldErrors(field.state.meta.errors)} />
              </Field>
            )}
          </form.Field>

          <form.Field name="rol">
            {(field) => (
              <Field>
                <FieldLabel htmlFor="rol">Rol</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(v) =>
                    field.handleChange(v as CreateUsuarioInput['rol'])
                  }
                >
                  <SelectTrigger id="rol">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {assignableRoles.map((rol) => (
                      <SelectItem key={rol} value={rol}>
                        {roleLabels[rol]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={toFieldErrors(field.state.meta.errors)} />
              </Field>
            )}
          </form.Field>

          <form.Field name="estatus">
            {(field) => (
              <Field>
                <FieldLabel htmlFor="estatus">Estatus</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(v) =>
                    field.handleChange(v as CreateUsuarioInput['estatus'])
                  }
                >
                  <SelectTrigger id="estatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {estatusUsuarioEnum.options.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {estatusUsuarioLabels[opt]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={toFieldErrors(field.state.meta.errors)} />
              </Field>
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="password">Contraseña inicial</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Mínimo 8 caracteres"
                />
                <FieldError errors={toFieldErrors(field.state.meta.errors)} />
              </Field>
            )}
          </form.Field>
        </div>

        <FormActions
          onCancel={onCancel}
          submitting={submitting}
          submitLabel={submitLabel ?? 'Crear usuario'}
        />
      </FieldGroup>
    </form>
  )
}

function UsuarioEditForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitting,
  submitLabel,
}: Omit<UsuarioFormProps, 'mode'>) {
  const form = useForm({
    defaultValues: { ...emptyEditValues, ...defaultValues },
    validators: { onSubmit: usuarioInputSchema },
    onSubmit: async ({ value }) => {
      await onSubmit(usuarioInputSchema.parse(value))
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="nombre">
            {(field) => (
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="nombre">Nombre completo</FieldLabel>
                <Input
                  id="nombre"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Ej. Lic. María García López"
                />
                <FieldError errors={toFieldErrors(field.state.meta.errors)} />
              </Field>
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="off"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="usuario@notaria.example"
                />
                <FieldError errors={toFieldErrors(field.state.meta.errors)} />
              </Field>
            )}
          </form.Field>

          <form.Field name="rol">
            {(field) => (
              <Field>
                <FieldLabel htmlFor="rol">Rol</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(v) =>
                    field.handleChange(v as UsuarioInput['rol'])
                  }
                >
                  <SelectTrigger id="rol">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {assignableRoles.map((rol) => (
                      <SelectItem key={rol} value={rol}>
                        {roleLabels[rol]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={toFieldErrors(field.state.meta.errors)} />
              </Field>
            )}
          </form.Field>

          <form.Field name="estatus">
            {(field) => (
              <Field>
                <FieldLabel htmlFor="estatus">Estatus</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(v) =>
                    field.handleChange(v as UsuarioInput['estatus'])
                  }
                >
                  <SelectTrigger id="estatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {estatusUsuarioEnum.options.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {estatusUsuarioLabels[opt]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={toFieldErrors(field.state.meta.errors)} />
              </Field>
            )}
          </form.Field>
        </div>

        <FormActions
          onCancel={onCancel}
          submitting={submitting}
          submitLabel={submitLabel ?? 'Guardar cambios'}
        />
      </FieldGroup>
    </form>
  )
}

export function UsuarioForm({ mode, ...props }: UsuarioFormProps) {
  if (mode === 'create') {
    return <UsuarioCreateForm {...props} />
  }
  return <UsuarioEditForm {...props} />
}
