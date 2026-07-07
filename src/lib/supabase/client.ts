// Cliente Supabase — Fase 2. La demo usa solo mockDb; ver demo-importacion.supabase.ts.
import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types.ts'

let client: SupabaseClient<Database> | null = null

export function isSupabaseConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
  )
}

export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) return null

  if (!client) {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    if (!url || !key) return null

    client = createClient<Database>(url, key)
  }

  return client
}
