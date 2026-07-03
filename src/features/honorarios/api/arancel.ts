import type { ArticuloArancel } from '../schemas'

/**
 * Motor de cálculo del Arancel Notarial (Estado de Puebla).
 *
 * IMPORTANTE: los valores de UMA y los tabuladores aquí son ILUSTRATIVOS y
 * deben ajustarse a la Ley del Arancel para el Cobro de Honorarios de los
 * Notarios del Estado de Puebla vigente. La estructura está lista para
 * sustituir estos parámetros sin tocar la UI ni los services.
 */

// Parámetros configurables -------------------------------------------------
export const ARANCEL_CONFIG = {
  // Valor diario de la UMA (configurable por el RFP).
  umaDiaria: 108.57,
  ivaRate: 0.16,
}

// Tabulador progresivo por valor de operación (porcentaje por tramo).
const tabulador: { hasta: number; tasa: number }[] = [
  { hasta: 100_000, tasa: 0.02 },
  { hasta: 500_000, tasa: 0.015 },
  { hasta: 1_000_000, tasa: 0.01 },
  { hasta: Number.POSITIVE_INFINITY, tasa: 0.0075 },
]

// Algunos artículos son cuota fija expresada en UMAs.
const cuotaFijaUMA: Partial<Record<ArticuloArancel, number>> = {
  art_8: 10, // actos sin valor determinado
  art_9: 8, // poderes
  art_22: 6, // fe de hechos / cotejos
}

/** Honorario base progresivo sobre el valor de la operación. */
export function honorarioPorValor(valor: number): number {
  let restante = Math.max(0, valor)
  let acumulado = 0
  let pisoAnterior = 0
  for (const tramo of tabulador) {
    if (restante <= 0) break
    const anchoTramo = tramo.hasta - pisoAnterior
    const gravable = Math.min(restante, anchoTramo)
    acumulado += gravable * tramo.tasa
    restante -= gravable
    pisoAnterior = tramo.hasta
  }
  return acumulado
}

export interface CalculoArancelInput {
  articulo: ArticuloArancel
  valorOperacion: number
  descuento: number // porcentaje 0-100
  recargo: number // porcentaje 0-100
}

export interface CalculoArancel {
  honorarioBase: number
  descuentoMonto: number
  recargoMonto: number
  subtotal: number
  iva: number
  total: number
}

function redondear(n: number): number {
  return Math.round(n * 100) / 100
}

/** Calcula el desglose completo de una cotización. */
export function calcularArancel({
  articulo,
  valorOperacion,
  descuento,
  recargo,
}: CalculoArancelInput): CalculoArancel {
  const cuotaFija = cuotaFijaUMA[articulo]
  const honorarioBase =
    cuotaFija != null
      ? cuotaFija * ARANCEL_CONFIG.umaDiaria
      : honorarioPorValor(valorOperacion)

  const descuentoMonto = honorarioBase * (descuento / 100)
  const recargoMonto = honorarioBase * (recargo / 100)
  const subtotal = Math.max(0, honorarioBase - descuentoMonto + recargoMonto)
  const iva = subtotal * ARANCEL_CONFIG.ivaRate
  const total = subtotal + iva

  return {
    honorarioBase: redondear(honorarioBase),
    descuentoMonto: redondear(descuentoMonto),
    recargoMonto: redondear(recargoMonto),
    subtotal: redondear(subtotal),
    iva: redondear(iva),
    total: redondear(total),
  }
}
