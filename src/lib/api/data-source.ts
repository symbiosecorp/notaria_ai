/**
 * Indica si el backend de Supabase (service role en servidor) está configurado.
 * Solo debe evaluarse en server functions — la service_role nunca va al cliente.
 */
export function isSupabaseAdminConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
  return Boolean(url && serviceRole)
}
