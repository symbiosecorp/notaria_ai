import { useState } from 'react'
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
  const [values, setValues] = useState<ClienteInput>({
    ...emptyValues,
    ...defaultValues,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function set<TKey extends keyof ClienteInput>(
    key: TKey,
    value: ClienteInput[TKey],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = clienteInputSchema.safeParse(values)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? '')
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    void onSubmit(result.data)
  }

  const esFisica = values.tipoPersona === 'fisica'

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Datos generales</FieldLegend>
          <div className="grid gap-6 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="tipoPersona">Tipo de persona</FieldLabel>
              <Select
                value={values.tipoPersona}
                onValueChange={(v) =>
                  set('tipoPersona', v as ClienteInput['tipoPersona'])
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
            <Field>
              <FieldLabel htmlFor="estatus">Estatus</FieldLabel>
              <Select
                value={values.estatus}
                onValueChange={(v) =>
                  set('estatus', v as ClienteInput['estatus'])
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
          </div>
          <Field>
            <FieldLabel htmlFor="nombre">
              {esFisica ? 'Nombre completo' : 'Razón social'}
            </FieldLabel>
            <Input
              id="nombre"
              value={values.nombre}
              onChange={(e) => set('nombre', e.target.value)}
            />
            <FieldError errors={errors.nombre ? [{ message: errors.nombre }] : undefined} />
          </Field>
          <div className="grid gap-6 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="rfc">RFC</FieldLabel>
              <Input
                id="rfc"
                value={values.rfc ?? ''}
                onChange={(e) => set('rfc', e.target.value.toUpperCase())}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="telefono">Teléfono</FieldLabel>
              <Input
                id="telefono"
                value={values.telefono ?? ''}
                onChange={(e) => set('telefono', e.target.value)}
              />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
            <Input
              id="email"
              type="email"
              value={values.email ?? ''}
              onChange={(e) => set('email', e.target.value)}
            />
            <FieldError errors={errors.email ? [{ message: errors.email }] : undefined} />
          </Field>
          <Field>
            <FieldLabel htmlFor="domicilio">Domicilio</FieldLabel>
            <Textarea
              id="domicilio"
              value={values.domicilio ?? ''}
              onChange={(e) => set('domicilio', e.target.value)}
            />
          </Field>
        </FieldSet>

        {esFisica ? (
          <FieldSet>
            <FieldLegend>Persona física</FieldLegend>
            <div className="grid gap-6 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="curp">CURP</FieldLabel>
                <Input
                  id="curp"
                  value={values.curp ?? ''}
                  onChange={(e) => set('curp', e.target.value.toUpperCase())}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="nacionalidad">Nacionalidad</FieldLabel>
                <Input
                  id="nacionalidad"
                  value={values.nacionalidad ?? ''}
                  onChange={(e) => set('nacionalidad', e.target.value)}
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="estadoCivil">Estado civil</FieldLabel>
              <Select
                value={values.estadoCivil}
                onValueChange={(v) =>
                  set('estadoCivil', v as ClienteInput['estadoCivil'])
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
          </FieldSet>
        ) : (
          <FieldSet>
            <FieldLegend>Persona moral</FieldLegend>
            <Field>
              <FieldLabel htmlFor="representanteLegal">
                Representante legal
              </FieldLabel>
              <Input
                id="representanteLegal"
                value={values.representanteLegal ?? ''}
                onChange={(e) => set('representanteLegal', e.target.value)}
              />
            </Field>
          </FieldSet>
        )}

        <FieldSet>
          <FieldLegend>Cumplimiento UIF / PLD</FieldLegend>
          <Field>
            <FieldLabel htmlFor="beneficiarioControlador">
              Beneficiario controlador
            </FieldLabel>
            <Input
              id="beneficiarioControlador"
              value={values.beneficiarioControlador ?? ''}
              onChange={(e) => set('beneficiarioControlador', e.target.value)}
            />
          </Field>
          <Field orientation="horizontal">
            <Switch
              id="esActividadVulnerable"
              checked={values.esActividadVulnerable}
              onCheckedChange={(v) => set('esActividadVulnerable', v)}
            />
            <FieldLabel htmlFor="esActividadVulnerable">
              Involucra actividad vulnerable
            </FieldLabel>
          </Field>
        </FieldSet>

        <Field>
          <FieldLabel htmlFor="notas">Notas</FieldLabel>
          <Textarea
            id="notas"
            value={values.notas ?? ''}
            onChange={(e) => set('notas', e.target.value)}
          />
        </Field>

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
