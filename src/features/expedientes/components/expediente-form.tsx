import { useState } from 'react'
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
import {
  expedienteInputSchema,
  estatusExpedienteEnum,
  estatusExpedienteLabels,
  tipoActoEnum,
  tipoActoLabels,
} from '../schemas'
import type {
  EstatusExpediente,
  ExpedienteInput,
  TipoActo,
} from '../schemas'

export interface ClienteOption {
  id: string
  nombre: string
}

interface FormValues {
  tipoActo: TipoActo
  clienteId: string
  descripcion: string
  responsable: string
  estatus: EstatusExpediente
  fechaLimite: string
  valorOperacion: string
  documentos: string
  notas: string
}

function buildInitial(defaults?: Partial<FormValues>): FormValues {
  return {
    tipoActo: 'compraventa',
    clienteId: '',
    descripcion: '',
    responsable: '',
    estatus: 'abierto',
    fechaLimite: '',
    valorOperacion: '',
    documentos: '',
    notas: '',
    ...defaults,
  }
}

export interface ExpedienteFormProps {
  clientes: ClienteOption[]
  defaultValues?: Partial<FormValues>
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
  const [values, setValues] = useState<FormValues>(buildInitial(defaultValues))
  const [errors, setErrors] = useState<Record<string, string>>({})

  function set<TKey extends keyof FormValues>(
    key: TKey,
    value: FormValues[TKey],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cliente = clientes.find((c) => c.id === values.clienteId)
    const payload = {
      tipoActo: values.tipoActo,
      clienteId: values.clienteId,
      clienteNombre: cliente?.nombre ?? '',
      descripcion: values.descripcion,
      responsable: values.responsable,
      estatus: values.estatus,
      fechaLimite: values.fechaLimite ? new Date(values.fechaLimite) : undefined,
      valorOperacion: values.valorOperacion
        ? Number(values.valorOperacion)
        : undefined,
      documentosPendientes: values.documentos
        .split('\n')
        .map((d) => d.trim())
        .filter(Boolean),
      notas: values.notas,
    }
    const result = expedienteInputSchema.safeParse(payload)
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

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="grid gap-6 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="tipoActo">Tipo de acto</FieldLabel>
            <Select
              value={values.tipoActo}
              onValueChange={(v) => set('tipoActo', v as TipoActo)}
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
          <Field>
            <FieldLabel htmlFor="estatus">Estatus</FieldLabel>
            <Select
              value={values.estatus}
              onValueChange={(v) => set('estatus', v as EstatusExpediente)}
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
        </div>

        <Field>
          <FieldLabel htmlFor="clienteId">Cliente</FieldLabel>
          <Select
            value={values.clienteId || undefined}
            onValueChange={(v) => set('clienteId', v)}
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
          <FieldError
            errors={errors.clienteId ? [{ message: errors.clienteId }] : undefined}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="descripcion">Descripción</FieldLabel>
          <Textarea
            id="descripcion"
            value={values.descripcion}
            onChange={(e) => set('descripcion', e.target.value)}
          />
        </Field>

        <div className="grid gap-6 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="responsable">Responsable</FieldLabel>
            <Input
              id="responsable"
              value={values.responsable}
              onChange={(e) => set('responsable', e.target.value)}
            />
            <FieldError
              errors={
                errors.responsable ? [{ message: errors.responsable }] : undefined
              }
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="fechaLimite">Fecha límite</FieldLabel>
            <Input
              id="fechaLimite"
              type="date"
              value={values.fechaLimite}
              onChange={(e) => set('fechaLimite', e.target.value)}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="valorOperacion">Valor de la operación</FieldLabel>
          <Input
            id="valorOperacion"
            type="number"
            min={0}
            value={values.valorOperacion}
            onChange={(e) => set('valorOperacion', e.target.value)}
          />
          <FieldDescription>Opcional, en pesos (MXN).</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="documentos">Documentos pendientes</FieldLabel>
          <Textarea
            id="documentos"
            value={values.documentos}
            placeholder="Un documento por línea"
            onChange={(e) => set('documentos', e.target.value)}
          />
          <FieldDescription>Escribe un documento por línea.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="notas">Notas</FieldLabel>
          <Textarea
            id="notas"
            value={values.notas}
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
