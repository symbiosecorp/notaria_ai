import { useForm } from '@tanstack/react-form'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { toFieldErrors } from '#/lib/forms'
import {
  expedienteInputSchema,
  estatusExpedienteEnum,
  estatusExpedienteLabels,
  tipoActoEnum,
  tipoActoLabels,
} from '../schemas'
import type { ExpedienteInput } from '../schemas'

export interface ClienteOption {
  id: string
  nombre: string
}

const emptyValues: ExpedienteInput = {
  tipoActo: 'compraventa',
  descripcion: '',
  clienteId: '',
  clienteNombre: '',
  responsable: '',
  estatus: 'abierto',
  fechaLimite: undefined,
  documentosPendientes: [],
  valorOperacion: undefined,
  notas: '',
}

function toDateInput(value: Date | undefined): string {
  if (!value) return ''
  return new Date(value).toISOString().slice(0, 10)
}

export interface ExpedienteFormProps {
  clientes: ClienteOption[]
  defaultValues?: Partial<ExpedienteInput>
  onSubmit: (values: ExpedienteInput) => void | Promise<void>
  onCancel?: () => void
  submitting?: boolean
  submitLabel?: string
}

export function ExpedienteForm({
  clientes,
  defaultValues,
  onSubmit,
  onCancel,
  submitting,
  submitLabel = 'Guardar',
}: ExpedienteFormProps) {
  const form = useForm({
    defaultValues: { ...emptyValues, ...defaultValues },
    validators: { onSubmit: expedienteInputSchema },
    onSubmit: async ({ value }) => {
      const cliente = clientes.find((c) => c.id === value.clienteId)
      await onSubmit(
        expedienteInputSchema.parse({
          ...value,
          clienteNombre: cliente?.nombre ?? '',
        }),
      )
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
        <div className="grid gap-6 md:grid-cols-2">
          <form.Field name="tipoActo">
            {(field) => (
              <Field>
                <FieldLabel htmlFor="tipoActo">Tipo de acto</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(v) =>
                    field.handleChange(v as ExpedienteInput['tipoActo'])
                  }
                >
                  <SelectTrigger id="tipoActo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tipoActoEnum.options.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {tipoActoLabels[opt]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    field.handleChange(v as ExpedienteInput['estatus'])
                  }
                >
                  <SelectTrigger id="estatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {estatusExpedienteEnum.options.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {estatusExpedienteLabels[opt]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          </form.Field>
        </div>

        <form.Field name="clienteId">
          {(field) => (
            <Field>
              <FieldLabel htmlFor="clienteId">Cliente</FieldLabel>
              <Select
                value={field.state.value || undefined}
                onValueChange={(v) => field.handleChange(v)}
              >
                <SelectTrigger id="clienteId">
                  <SelectValue placeholder="Selecciona un cliente…" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={toFieldErrors(field.state.meta.errors)} />
            </Field>
          )}
        </form.Field>

        <form.Field name="descripcion">
          {(field) => (
            <Field>
              <FieldLabel htmlFor="descripcion">Descripción</FieldLabel>
              <Textarea
                id="descripcion"
                value={field.state.value ?? ''}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Field>
          )}
        </form.Field>

        <div className="grid gap-6 md:grid-cols-2">
          <form.Field name="responsable">
            {(field) => (
              <Field>
                <FieldLabel htmlFor="responsable">Responsable</FieldLabel>
                <Input
                  id="responsable"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldError errors={toFieldErrors(field.state.meta.errors)} />
              </Field>
            )}
          </form.Field>
          <form.Field name="fechaLimite">
            {(field) => (
              <Field>
                <FieldLabel htmlFor="fechaLimite">Fecha límite</FieldLabel>
                <Input
                  id="fechaLimite"
                  type="date"
                  value={toDateInput(field.state.value)}
                  onChange={(e) =>
                    field.handleChange(
                      e.target.value ? new Date(e.target.value) : undefined,
                    )
                  }
                />
              </Field>
            )}
          </form.Field>
        </div>

        <form.Field name="valorOperacion">
          {(field) => (
            <Field>
              <FieldLabel htmlFor="valorOperacion">
                Valor de la operación
              </FieldLabel>
              <Input
                id="valorOperacion"
                type="number"
                min={0}
                value={field.state.value ?? ''}
                onChange={(e) =>
                  field.handleChange(
                    e.target.value === '' ? undefined : Number(e.target.value),
                  )
                }
              />
              <FieldDescription>Opcional, en pesos (MXN).</FieldDescription>
            </Field>
          )}
        </form.Field>

        <form.Field name="documentosPendientes">
          {(field) => (
            <Field>
              <FieldLabel htmlFor="documentos">Documentos pendientes</FieldLabel>
              <Textarea
                id="documentos"
                value={field.state.value.join('\n')}
                placeholder="Un documento por línea"
                onChange={(e) =>
                  field.handleChange(
                    e.target.value
                      .split('\n')
                      .map((d) => d.trim())
                      .filter(Boolean),
                  )
                }
              />
              <FieldDescription>Escribe un documento por línea.</FieldDescription>
            </Field>
          )}
        </form.Field>

        <form.Field name="notas">
          {(field) => (
            <Field>
              <FieldLabel htmlFor="notas">Notas</FieldLabel>
              <Textarea
                id="notas"
                value={field.state.value ?? ''}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Field>
          )}
        </form.Field>

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Guardando…' : submitLabel}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
        </div>
      </FieldGroup>
    </form>
  )
}
