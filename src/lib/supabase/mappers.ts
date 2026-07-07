// Mappers Supabase ↔ dominio — Fase 2. Referencia para cuando conectes el backend.
import type { Cliente } from '#/features/clientes'
import type { Expediente } from '#/features/expedientes'
import type { ClienteRow, ExpedienteRow } from './database.types.ts'

export function mapClienteRow(row: ClienteRow): Cliente {
  return {
    id: row.id,
    tipoPersona: row.tipo_persona as Cliente['tipoPersona'],
    nombre: row.nombre,
    rfc: row.rfc,
    email: row.email,
    telefono: row.telefono,
    domicilio: row.domicilio,
    estatus: row.estatus as Cliente['estatus'],
    curp: row.curp,
    nacionalidad: row.nacionalidad,
    estadoCivil: row.estado_civil as Cliente['estadoCivil'],
    representanteLegal: row.representante_legal,
    beneficiarioControlador: row.beneficiario_controlador,
    esActividadVulnerable: row.es_actividad_vulnerable,
    notas: row.notas,
    createdAt: new Date(row.created_at),
    updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
  }
}

export function mapExpedienteRow(row: ExpedienteRow): Expediente {
  return {
    id: row.id,
    folio: row.folio,
    tipoActo: row.tipo_acto as Expediente['tipoActo'],
    descripcion: row.descripcion,
    clienteId: row.cliente_id,
    clienteNombre: row.cliente_nombre,
    responsable: row.responsable,
    estatus: row.estatus as Expediente['estatus'],
    fechaApertura: new Date(row.fecha_apertura),
    fechaLimite: row.fecha_limite ? new Date(row.fecha_limite) : undefined,
    documentosPendientes: row.documentos_pendientes,
    valorOperacion:
      row.valor_operacion != null ? Number(row.valor_operacion) : undefined,
    notas: row.notas,
    createdAt: new Date(row.created_at),
    updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
  }
}

export function toClienteInsert(cliente: Cliente) {
  return {
    id: cliente.id,
    tipo_persona: cliente.tipoPersona,
    nombre: cliente.nombre,
    rfc: cliente.rfc ?? '',
    email: cliente.email ?? '',
    telefono: cliente.telefono ?? '',
    domicilio: cliente.domicilio ?? '',
    estatus: cliente.estatus,
    curp: cliente.curp ?? '',
    nacionalidad: cliente.nacionalidad ?? '',
    estado_civil: cliente.estadoCivil ?? null,
    representante_legal: cliente.representanteLegal ?? '',
    beneficiario_controlador: cliente.beneficiarioControlador ?? '',
    es_actividad_vulnerable: cliente.esActividadVulnerable,
    notas: cliente.notas ?? '',
    created_at: cliente.createdAt.toISOString(),
    updated_at: (cliente.updatedAt ?? cliente.createdAt).toISOString(),
  }
}

export function toExpedienteInsert(expediente: Expediente) {
  return {
    id: expediente.id,
    folio: expediente.folio,
    tipo_acto: expediente.tipoActo,
    descripcion: expediente.descripcion ?? '',
    cliente_id: expediente.clienteId,
    cliente_nombre: expediente.clienteNombre,
    responsable: expediente.responsable,
    estatus: expediente.estatus,
    fecha_apertura: expediente.fechaApertura.toISOString(),
    fecha_limite: expediente.fechaLimite?.toISOString() ?? null,
    documentos_pendientes: expediente.documentosPendientes,
    valor_operacion: expediente.valorOperacion ?? null,
    notas: expediente.notas ?? '',
    created_at: expediente.createdAt.toISOString(),
    updated_at: (expediente.updatedAt ?? expediente.createdAt).toISOString(),
  }
}
