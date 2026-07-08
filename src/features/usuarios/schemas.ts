import { z } from 'zod'
import { ROLES } from '#/lib/auth/permissions.ts'

export const roleEnum = z.enum([
  ROLES.ADMIN,
  ROLES.NOTARIO,
  ROLES.ABOGADO,
  ROLES.ASISTENTE,
  ROLES.CONTADOR,
  ROLES.INVITADO,
])
export type UsuarioRole = z.infer<typeof roleEnum>

export const roleLabels: Record<UsuarioRole, string> = {
  admin: 'Administrador',
  notario: 'Notario',
  abogado: 'Abogado/a',
  asistente: 'Asistente',
  contador: 'Contador',
  invitado: 'Invitado',
}

/** Roles asignables al dar de alta o editar un usuario (excluye invitado). */
export const assignableRoles = roleEnum.options.filter((r) => r !== ROLES.INVITADO)

export const estatusUsuarioEnum = z.enum(['activo', 'inactivo', 'pendiente'])
export type EstatusUsuario = z.infer<typeof estatusUsuarioEnum>

export const estatusUsuarioLabels: Record<EstatusUsuario, string> = {
  activo: 'Activo',
  inactivo: 'Inactivo',
  pendiente: 'Pendiente',
}

export const usuarioSchema = z.object({
  id: z.string(),
  email: z.string().email('Correo inválido'),
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  rol: roleEnum,
  estatus: estatusUsuarioEnum,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  lastLoginAt: z.coerce.date().optional(),
})
export type Usuario = z.infer<typeof usuarioSchema>

export const usuarioInputSchema = usuarioSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
})
export type UsuarioInput = z.infer<typeof usuarioInputSchema>

export const createUsuarioInputSchema = usuarioInputSchema.extend({
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
})
export type CreateUsuarioInput = z.infer<typeof createUsuarioInputSchema>

export const cambiarContrasenaInputSchema = z
  .object({
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma la contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })
export type CambiarContrasenaInput = z.infer<typeof cambiarContrasenaInputSchema>
