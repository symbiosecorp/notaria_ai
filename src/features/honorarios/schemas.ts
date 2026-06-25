import { z } from 'zod'

// Artículos del Arancel Notarial del Estado de Puebla referidos en el RFP.
export const articuloArancelEnum = z.enum([
  'art_7',
  'art_8',
  'art_9',
  'art_15',
  'art_18',
  'art_22',
  'art_25_33',
  'otro',
])
export type ArticuloArancel = z.infer<typeof articuloArancelEnum>
export const articuloArancelLabels: Record<ArticuloArancel, string> = {
  art_7: 'Art. 7 — Escrituras con valor determinado',
  art_8: 'Art. 8 — Actos sin valor determinado',
  art_9: 'Art. 9 — Poderes',
  art_15: 'Art. 15 — Sociedades',
  art_18: 'Art. 18 — Protocolización',
  art_22: 'Art. 22 — Fe de hechos / cotejos',
  art_25_33: 'Arts. 25 a 33 — Conceptos especiales',
  otro: 'Otro concepto',
}

export const estatusCotizacionEnum = z.enum([
  'borrador',
  'enviada',
  'aceptada',
  'rechazada',
])
export type EstatusCotizacion = z.infer<typeof estatusCotizacionEnum>
export const estatusCotizacionLabels: Record<EstatusCotizacion, string> = {
  borrador: 'Borrador',
  enviada: 'Enviada',
  aceptada: 'Aceptada',
  rechazada: 'Rechazada',
}

export const cotizacionSchema = z.object({
  id: z.string(),
  folio: z.string(),
  concepto: z.string().min(1, 'Describe el concepto'),
  clienteId: z.string().optional().or(z.literal('')),
  clienteNombre: z.string().optional().or(z.literal('')),
  articulo: articuloArancelEnum,
  valorOperacion: z.number().nonnegative(),
  // Importes calculados por el motor de arancel
  honorarioBase: z.number().nonnegative(),
  descuento: z.number().min(0).max(100), // porcentaje
  recargo: z.number().min(0).max(100), // porcentaje
  subtotal: z.number().nonnegative(),
  iva: z.number().nonnegative(),
  total: z.number().nonnegative(),
  estatus: estatusCotizacionEnum,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
})
export type Cotizacion = z.infer<typeof cotizacionSchema>

// Lo que captura el usuario; el resto de importes los calcula el service.
export const cotizacionInputSchema = z.object({
  concepto: z.string().min(1, 'Describe el concepto'),
  clienteId: z.string().optional().or(z.literal('')),
  clienteNombre: z.string().optional().or(z.literal('')),
  articulo: articuloArancelEnum,
  valorOperacion: z.number().nonnegative(),
  descuento: z.number().min(0).max(100).default(0),
  recargo: z.number().min(0).max(100).default(0),
  estatus: estatusCotizacionEnum.default('borrador'),
})
export type CotizacionInput = z.infer<typeof cotizacionInputSchema>
