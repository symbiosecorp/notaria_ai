import { useForm } from '@tanstack/react-form'
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
import { toFieldErrors } from '#/lib/forms'
import { formatCurrency } from '#/lib/format'
import { ARANCEL_CONFIG, calcularArancel } from '../api/arancel'
import {
  articuloArancelEnum,
  articuloArancelLabels,
  cotizacionInputSchema,
  estatusCotizacionEnum,
  estatusCotizacionLabels,
} from '../schemas'
import type { CotizacionInput } from '../schemas'

const SIN_CLIENTE = '__none__'

export interface ClienteOption {
  id: string
  nombre: string
}

const emptyValues: CotizacionInput = {
  concepto: '',
  clienteId: '',
  clienteNombre: '',
  articulo: 'art_7',
  valorOperacion: 0,
  descuento: 0,
  recargo: 0,
  estatus: 'borrador',
}

export interface CotizacionFormProps {
  clientes: ClienteOption[]
  defaultValues?: Partial<CotizacionInput>
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
  const form = useForm({
    defaultValues: { ...emptyValues, ...defaultValues },
    validators: { onSubmit: cotizacionInputSchema },
    onSubmit: async ({ value }) => {
      const cliente = clientes.find((c) => c.id === value.clienteId)
      await onSubmit(
        cotizacionInputSchema.parse({
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
      className="grid gap-6 lg:grid-cols-3"
    >
      <div className="lg:col-span-2">
        <FieldGroup>
          <form.Field name="concepto">
            {(field) => (
              <Field>
                <FieldLabel htmlFor="concepto">Concepto</FieldLabel>
                <Input
                  id="concepto"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldError errors={toFieldErrors(field.state.meta.errors)} />
              </Field>
            )}
          </form.Field>

          <div className="grid gap-6 md:grid-cols-2">
            <form.Field name="clienteId">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="cliente">Cliente</FieldLabel>
                  <Select
                    value={field.state.value || SIN_CLIENTE}
                    onValueChange={(v) =>
                      field.handleChange(v === SIN_CLIENTE ? '' : v)
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
              )}
            </form.Field>
            <form.Field name="estatus">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="estatus">Estatus</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) =>
                      field.handleChange(v as CotizacionInput['estatus'])
                    }
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
              )}
            </form.Field>
          </div>

          <form.Field name="articulo">
            {(field) => (
              <Field>
                <FieldLabel htmlFor="articulo">Artículo del arancel</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(v) =>
                    field.handleChange(v as CotizacionInput['articulo'])
                  }
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
            )}
          </form.Field>

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
                  value={field.state.value || ''}
                  onChange={(e) =>
                    field.handleChange(
                      e.target.value === '' ? 0 : Number(e.target.value),
                    )
                  }
                />
                <FieldDescription>
                  Algunos artículos usan cuota fija en UMAs y no dependen de este
                  valor.
                </FieldDescription>
              </Field>
            )}
          </form.Field>

          <div className="grid gap-6 md:grid-cols-2">
            <form.Field name="descuento">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="descuento">Descuento (%)</FieldLabel>
                  <Input
                    id="descuento"
                    type="number"
                    min={0}
                    max={100}
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value === '' ? 0 : Number(e.target.value),
                      )
                    }
                  />
                  <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                </Field>
              )}
            </form.Field>
            <form.Field name="recargo">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="recargo">Recargo (%)</FieldLabel>
                  <Input
                    id="recargo"
                    type="number"
                    min={0}
                    max={100}
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value === '' ? 0 : Number(e.target.value),
                      )
                    }
                  />
                  <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                </Field>
              )}
            </form.Field>
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
        <form.Subscribe
          selector={(s) => ({
            articulo: s.values.articulo,
            valorOperacion: s.values.valorOperacion,
            descuento: s.values.descuento,
            recargo: s.values.recargo,
          })}
        >
          {({ articulo, valorOperacion, descuento, recargo }) => {
            const calculo = calcularArancel({
              articulo,
              valorOperacion: valorOperacion || 0,
              descuento: descuento || 0,
              recargo: recargo || 0,
            })
            return (
              <div className="island-shell sticky top-20 space-y-3 rounded-lg p-5">
                <p className="island-kicker">Desglose estimado</p>
                <DesgloseRow
                  label="Honorario base"
                  value={calculo.honorarioBase}
                />
                <DesgloseRow
                  label="Descuento"
                  value={-calculo.descuentoMonto}
                  muted
                />
                <DesgloseRow
                  label="Recargo"
                  value={calculo.recargoMonto}
                  muted
                />
                <DesgloseRow label="Subtotal" value={calculo.subtotal} />
                <DesgloseRow label="IVA (16%)" value={calculo.iva} muted />
                <div className="border-t pt-3">
                  <DesgloseRow label="Total" value={calculo.total} strong />
                </div>
                <p className="text-xs text-muted-foreground">
                  UMA diaria: {formatCurrency(ARANCEL_CONFIG.umaDiaria)}. Valores
                  del arancel ilustrativos, ajustables en el motor.
                </p>
              </div>
            )
          }}
        </form.Subscribe>
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
