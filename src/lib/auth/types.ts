import type { Role } from './permissions.ts'

/** Usuario de sesión: identidad de Supabase Auth + perfil (nombre y rol). */
export interface User {
  id: string
  email: string
  name: string
  role: Role
}
