export const ROLES = {
  ADMIN: 'admin',
  NOTARIO: 'notario',
  ABOGADO: 'abogado',
  ASISTENTE: 'asistente',
  CONTADOR: 'contador',
  INVITADO: 'invitado',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const PERMISSIONS = {
  // Dashboard
  'dashboard:view': ['admin', 'notario', 'abogado', 'asistente', 'contador'],

  // Clientes
  'clientes:view': ['admin', 'notario', 'abogado', 'asistente'],
  'clientes:create': ['admin', 'notario', 'abogado', 'asistente'],
  'clientes:edit': ['admin', 'notario', 'abogado', 'asistente'],
  'clientes:delete': ['admin', 'notario'],

  // Expedientes
  'expedientes:view': ['admin', 'notario', 'abogado', 'asistente'],
  'expedientes:create': ['admin', 'notario', 'abogado', 'asistente'],
  'expedientes:edit': ['admin', 'notario', 'abogado', 'asistente'],
  'expedientes:delete': ['admin', 'notario'],

  // Honorarios
  'honorarios:view': ['admin', 'notario', 'contador'],
  'honorarios:edit': ['admin', 'notario', 'contador'],

  // Documental
  'documental:view': ['admin', 'notario', 'abogado', 'asistente'],
  'documental:upload': ['admin', 'notario', 'abogado', 'asistente'],
  'documental:delete': ['admin', 'notario'],

  // Gobierno y cumplimiento
  'registro_publico:view': ['admin', 'notario', 'abogado'],
  'fiscal:view': ['admin', 'notario', 'contador'],
  'uif:view': ['admin', 'notario', 'abogado'],

  // Agenda
  'agenda:view': ['admin', 'notario', 'abogado', 'asistente'],
  'agenda:edit': ['admin', 'notario', 'abogado', 'asistente'],

  // Inteligencia
  'reportes:view': ['admin', 'notario', 'contador'],
  'ia:view': ['admin', 'notario', 'abogado', 'asistente'],

  // Administración
  'configuracion:view': ['admin', 'notario'],
  'usuarios:manage': ['admin'],
  'roles:manage': ['admin'],
  'bitacora:view': ['admin'],
} as const

export type Permission = keyof typeof PERMISSIONS

export function hasPermission(role: Role | string, permission: Permission): boolean {
  const allowed = PERMISSIONS[permission] as readonly string[]
  return allowed.includes(role)
}

export function hasAnyPermission(role: Role | string, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p))
}
