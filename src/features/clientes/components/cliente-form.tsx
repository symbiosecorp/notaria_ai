import { useForm } from '@tanstack/react-form'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { Switch } from '#/components/ui/switch'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
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
  clienteInputSchema,
  estadoCivilEnum,
  estadoCivilLabels,
  estatusClienteEnum,
  estatusClienteLabels,
  tipoPersonaEnum,
  tipoPersonaLabels,
} from '../schemas'
import type { ClienteInput } from '../schemas'

const emptyValues: ClienteInput = {
  tipoPersona: 'fisica',
  nombre: '',
  rfc: '',
  email: '',
  telefono: '',
  domicilio: '',
  estatus: 'prospecto',
  curp: '',
  nacionalidad: 'Mexicana',
  estadoCivil: undefined,
  representanteLegal: '',
  beneficiarioControlador: '',
  esActividadVulnerable: false,
  notas: '',
}

export interface ClienteFormProps {
  defaultValues?: Partial<ClienteInput>
  onSubmit: (values: ClienteInput) => void | Promise<void>
  onCancel?: () => void
  submitting?: boolean
  submitLabel?: string
}

export function ClienteForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitting,
  submitLabel = 'Guardar',
}: ClienteFormProps) {
  const form = useForm({
    defaultValues: { ...emptyValues, ...defaultValues },
    validators: { onSubmit: clienteInputSchema },
    onSubmit: async ({ value }) => {
      await onSubmit(clienteInputSchema.parse(value))
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
        <FieldSet>
          <FieldLegend>Datos generales</FieldLegend>
          <div className="grid gap-6 md:grid-cols-2">
            <form.Field name="tipoPersona">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="tipoPersona">Tipo de persona</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) =>
                      field.handleChange(v as ClienteInput['tipoPersona'])
                    }
                  >
                    <SelectTrigger id="tipoPersona">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tipoPersonaEnum.options.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {tipoPersonaLabels[opt]}
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
                      field.handleChange(v as ClienteInput['estatus'])
                    }
                  >
                    <SelectTrigger id="estatus">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {estatusClienteEnum.options.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {estatusClienteLabels[opt]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </form.Field>
          </div>

          <form.Subscribe selector={(s) => s.values.tipoPersona}>
            {(tipoPersona) => (
              <form.Field name="nombre">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="nombre">
                      {tipoPersona === 'fisica'
                        ? 'Nombre completo'
                        : 'Razón social'}
                    </FieldLabel>
                    <Input
                      id="nombre"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                  </Field>
                )}
              </form.Field>
            )}
          </form.Subscribe>

          <div className="grid gap-6 md:grid-cols-2">
            <form.Field name="rfc">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="rfc">RFC</FieldLabel>
                  <Input
                    id="rfc"
                    value={field.state.value ?? ''}
                    onChange={(e) =>
                      field.handleChange(e.target.value.toUpperCase())
                    }
                  />
                </Field>
              )}
            </form.Field>
            <form.Field name="telefono">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="telefono">Teléfono</FieldLabel>
                  <Input
                    id="telefono"
                    value={field.state.value ?? ''}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </Field>
              )}
            </form.Field>
          </div>

          <form.Field name="email">
            {(field) => (
              <Field>
                <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={field.state.value ?? ''}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldError errors={toFieldErrors(field.state.meta.errors)} />
              </Field>
            )}
          </form.Field>

          <form.Field name="domicilio">
            {(field) => (
              <Field>
                <FieldLabel htmlFor="domicilio">Domicilio</FieldLabel>
                <Textarea
                  id="domicilio"
                  value={field.state.value ?? ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )}
          </form.Field>
        </FieldSet>

        <form.Subscribe selector={(s) => s.values.tipoPersona}>
          {(tipoPersona) =>
            tipoPersona === 'fisica' ? (
              <FieldSet>
                <FieldLegend>Persona física</FieldLegend>
                <div className="grid gap-6 md:grid-cols-2">
                  <form.Field name="curp">
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor="curp">CURP</FieldLabel>
                        <Input
                          id="curp"
                          value={field.state.value ?? ''}
                          onChange={(e) =>
                            field.handleChange(e.target.value.toUpperCase())
                          }
                        />
                      </Field>
                    )}
                  </form.Field>
                  <form.Field name="nacionalidad">
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor="nacionalidad">
                          Nacionalidad
                        </FieldLabel>
                        <Input
                          id="nacionalidad"
                          value={field.state.value ?? ''}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </Field>
                    )}
                  </form.Field>
                </div>
                <form.Field name="estadoCivil">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="estadoCivil">Estado civil</FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={(v) =>
                          field.handleChange(v as ClienteInput['estadoCivil'])
                        }
                      >
                        <SelectTrigger id="estadoCivil">
                          <SelectValue placeholder="Selecciona…" />
                        </SelectTrigger>
                        <SelectContent>
                          {estadoCivilEnum.options.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {estadoCivilLabels[opt]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                </form.Field>
              </FieldSet>
            ) : (
              <FieldSet>
                <FieldLegend>Persona moral</FieldLegend>
                <form.Field name="representanteLegal">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="representanteLegal">
                        Representante legal
                      </FieldLabel>
                      <Input
                        id="representanteLegal"
                        value={field.state.value ?? ''}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </Field>
                  )}
                </form.Field>
              </FieldSet>
            )
          }
        </form.Subscribe>

        <FieldSet>
          <FieldLegend>Cumplimiento UIF / PLD</FieldLegend>
          <form.Field name="beneficiarioControlador">
            {(field) => (
              <Field>
                <FieldLabel htmlFor="beneficiarioControlador">
                  Beneficiario controlador
                </FieldLabel>
                <Input
                  id="beneficiarioControlador"
                  value={field.state.value ?? ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="esActividadVulnerable">
            {(field) => (
              <Field orientation="horizontal">
                <Switch
                  id="esActividadVulnerable"
                  checked={field.state.value}
                  onCheckedChange={(v) => field.handleChange(v)}
                />
                <FieldLabel htmlFor="esActividadVulnerable">
                  Involucra actividad vulnerable
                </FieldLabel>
              </Field>
            )}
          </form.Field>
        </FieldSet>

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
