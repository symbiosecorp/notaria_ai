export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clientes: {
        Row: {
          id: string
          tipo_persona: string
          nombre: string
          rfc: string
          email: string
          telefono: string
          domicilio: string
          estatus: string
          curp: string
          nacionalidad: string
          estado_civil: string | null
          representante_legal: string
          beneficiario_controlador: string
          es_actividad_vulnerable: boolean
          notas: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tipo_persona: string
          nombre: string
          rfc?: string
          email?: string
          telefono?: string
          domicilio?: string
          estatus?: string
          curp?: string
          nacionalidad?: string
          estado_civil?: string | null
          representante_legal?: string
          beneficiario_controlador?: string
          es_actividad_vulnerable?: boolean
          notas?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['clientes']['Insert']>
        Relationships: []
      }
      expedientes: {
        Row: {
          id: string
          folio: string
          tipo_acto: string
          descripcion: string
          cliente_id: string
          cliente_nombre: string
          responsable: string
          estatus: string
          fecha_apertura: string
          fecha_limite: string | null
          documentos_pendientes: string[]
          valor_operacion: number | null
          notas: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          folio: string
          tipo_acto: string
          descripcion?: string
          cliente_id: string
          cliente_nombre: string
          responsable: string
          estatus?: string
          fecha_apertura?: string
          fecha_limite?: string | null
          documentos_pendientes?: string[]
          valor_operacion?: number | null
          notas?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['expedientes']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'expedientes_cliente_id_fkey'
            columns: ['cliente_id']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
        ]
      }
      documentos_historial: {
        Row: {
          id: string
          cliente_id: string | null
          expediente_id: string | null
          storage_path: string
          file_name: string
          mime_type: string
          file_size: number
          tipo_acto_detectado: string | null
          estado: string
          error_mensaje: string | null
          created_at: string
        }
        Insert: {
          id?: string
          cliente_id?: string | null
          expediente_id?: string | null
          storage_path: string
          file_name: string
          mime_type?: string
          file_size?: number
          tipo_acto_detectado?: string | null
          estado?: string
          error_mensaje?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['documentos_historial']['Insert']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type ClienteRow = Database['public']['Tables']['clientes']['Row']
export type ExpedienteRow = Database['public']['Tables']['expedientes']['Row']
export type DocumentoHistorialRow =
  Database['public']['Tables']['documentos_historial']['Row']
