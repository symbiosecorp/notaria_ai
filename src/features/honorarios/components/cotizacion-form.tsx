import { useMemo, useState } from 'react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
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
import { formatCurrency } from '#/lib/format'
import { ARANCEL_CONFIG, calcularArancel } from '../api/arancel'
import {
  articuloArancelEnum,
  articuloArancelLabels,
  cotizacionInputSchema,
  estatusCotizacionEnum,
  estatusCotizacionLabels,
} from '../schemas'
import type {
  ArticuloArancel,
  CotizacionInput,
  EstatusCotizacion,
} from '../schemas'

const SIN_CLIENTE = '__none__'

export interface ClienteOption {
  id: string
  nombre: string
}

interface FormValues {
  concepto: string
  clienteId: string
  articulo: ArticuloArancel
  valorOperacion: string
  descuento: string
  recargo: string
  estatus: EstatusCotizacion
}

function buildInitial(defaults?: Partial<FormValues>): FormValues {
  return {
    concepto: '',
    clienteId: '',
    articulo: 'art_7',
    valorOperacion: '',
    descuento: '0',
    recargo: '0',
    estatus: 'borrador',
    ...defaults,
  }
}

export interface CotizacionFormProps {
  clientes: ClienteOption[]
  defaultValues?: Partial<FormValues>
  onSubmit: (values: CotizacionInput) => void | Promise<void>
  onCancel?: () => void
  submitting?: boolean
  submitLabel?: string
}

export function CotizacionForm({
  clientes,
  defaultValues,
  onSubmit,
  onCancel,
  submitting,
  submitLabel = 'Guardar',
}: CotizacionFormProps) {
  const [values, setValues] = useState<FormValues>(buildInitial(defaultValues))
  const [errors, setErrors] = useState<Record<string, string>>({})

  function set<TKey extends keyof FormValues>(
    key: TKey,
    value: FormValues[TKey],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const calculo = useMemo(
    () =>
      calcularArancel({
        articulo: values.articulo,
        valorOperacion: Number(values.valorOperacion) || 0,
        descuento: Number(values.descuento) || 0,
        recargo: Number(values.recargo) || 0,
      }),
    [values.articulo, values.valorOperacion, values.descuento, values.recargo],
  )

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cliente = clientes.find((c) => c.id === values.clienteId)
    const payload = {
      concepto: values.concepto,
      clienteId: values.clienteId,
      clienteNombre: cliente?.nombre ?? '',
      articulo: values.articulo,
      valorOperacion: Number(values.valorOperacion) || 0,
      descuento: Number(values.descuento) || 0,
      recargo: Number(values.recargo) || 0,
      estatus: values.estatus,
    }
    const result = cotizacionInputSchema.safeParse(payload)
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
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="concepto">Concepto</FieldLabel>
            <Input
              id="concepto"
              value={values.concepto}
              onChange={(e) => set('concepto', e.target.value)}
            />
            <FieldError
              errors={errors.concepto ? [{ message: errors.concepto }] : undefined}
            />
          </Field>

          <div className="grid gap-6 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="cliente">Cliente</FieldLabel>
              <Select
                value={values.clienteId || SIN_CLIENTE}
                onValueChange={(v) =>
                  set('clienteId', v === SIN_CLIENTE ? '' : v)
                }
              >
                <SelectTrigger id="cliente">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SIN_CLIENTE}>Sin cliente</SelectItem>
                  {clientes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="estatus">Estatus</FieldLabel>
              <Select
                value={values.estatus}
                onValueChange={(v) => set('estatus', v as EstatusCotizacion)}
              >
                <SelectTrigger id="estatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {estatusCotizacionEnum.options.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {estatusCotizacionLabels[opt]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="articulo">Artículo del arancel</FieldLabel>
            <Select
              value={values.articulo}
              onValueChange={(v) => set('articulo', v as ArticuloArancel)}
            >
              <SelectTrigger id="articulo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {articuloArancelEnum.options.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {articuloArancelLabels[opt]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="valorOperacion">
              Valor de la operación
            </FieldLabel>
            <Input
              id="valorOperacion"
              type="number"
              min={0}
              value={values.valorOperacion}
              onChange={(e) => set('valorOperacion', e.target.value)}
            />
            <FieldDescription>
              Algunos artículos usan cuota fija en UMAs y no dependen de este
              valor.
            </FieldDescription>
          </Field>

          <div className="grid gap-6 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="descuento">Descuento (%)</FieldLabel>
              <Input
                id="descuento"
                type="number"
                min={0}
                max={100}
                value={values.descuento}
                onChange={(e) => set('descuento', e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="recargo">Recargo (%)</FieldLabel>
              <Input
                id="recargo"
                type="number"
                min={0}
                max={100}
                value={values.recargo}
                onChange={(e) => set('recargo', e.target.value)}
              />
            </Field>
          </div>

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
      </div>

      <aside className="lg:col-span-1">
        <div className="island-shell sticky top-20 space-y-3 rounded-lg p-5">
          <p className="island-kicker">Desglose estimado</p>
          <DesgloseRow label="Honorario base" value={calculo.honorarioBase} />
          <DesgloseRow
            label="Descuento"
            value={-calculo.descuentoMonto}
            muted
          />
          <DesgloseRow label="Recargo" value={calculo.recargoMonto} muted />
          <DesgloseRow label="Subtotal" value={calculo.subtotal} />
          <DesgloseRow label="IVA (16%)" value={calculo.iva} muted />
          <div className="border-t pt-3">
            <DesgloseRow label="Total" value={calculo.total} strong />
          </div>
          <p className="text-xs text-muted-foreground">
            UMA diaria: {formatCurrency(ARANCEL_CONFIG.umaDiaria)}. Valores del
            arancel ilustrativos, ajustables en el motor.
          </p>
        </div>
      </aside>
    </form>
  )
}

function DesgloseRow({
  label,
  value,
  muted,
  strong,
}: {
  label: string
  value: number
  muted?: boolean
  strong?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={muted ? 'text-muted-foreground' : undefined}>
        {label}
      </span>
      <span className={strong ? 'text-lg font-bold text-sea-ink' : 'font-medium'}>
        {formatCurrency(value)}
      </span>
    </div>
  )
}
