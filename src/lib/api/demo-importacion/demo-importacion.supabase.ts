/**
 * Referencia para Fase 2 — Supabase Storage + DB.
 * No se usa en la demo; descomenta e integra cuando conectes el backend real.
 *
 * import { getSupabaseClient } from '#/lib/supabase/client.ts'
 * import { mapClienteRow, mapExpedienteRow, toClienteInsert, toExpedienteInsert } from '#/lib/supabase/mappers.ts'
 *
 * const STORAGE_BUCKET = 'historial-clientes'
 *
 * async function uploadToStorage(file: File, clienteId: string) {
 *   const supabase = getSupabaseClient()
 *   if (!supabase) return undefined
 *   const storagePath = `${clienteId}/${crypto.randomUUID()}-${file.name}`
 *   const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(storagePath, file)
 *   if (error) throw error
 *   return storagePath
 * }
 *
 * async function persistDocumentoHistorial(input: { ... }) {
 *   await getSupabaseClient()?.from('documentos_historial').insert({ ... })
 * }
 *
 * async function createClienteInSupabase(cliente: Cliente) {
 *   const { data } = await getSupabaseClient()!
 *     .from('clientes').insert(toClienteInsert(cliente)).select('*').single()
 *   return mapClienteRow(data)
 * }
 */

export {}
