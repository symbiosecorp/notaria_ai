import { ROLES } from '#/lib/auth/permissions.ts'
import { mockDb } from '#/lib/api/mock-db'
import { AppError } from '#/lib/errors/app-error'
import {
  cambiarContrasenaInputSchema,
  createUsuarioInputSchema,
  usuarioInputSchema,
  usuarioSchema,
} from '../schemas.ts'
import type {
  CambiarContrasenaInput,
  CreateUsuarioInput,
  Usuario,
  UsuarioInput,
} from '../schemas.ts'

const FEATURE = 'usuarios'

function assertNotLastAdmin(id: string) {
  const user = mockDb.usuarios.find((u) => u.id === id)
  if (user?.rol !== ROLES.ADMIN) return

  const adminCount = mockDb.usuarios.filter(
    (u) => u.rol === ROLES.ADMIN && u.estatus === 'activo',
  ).length
  if (adminCount <= 1) {
    throw new AppError(
      'VALIDATION_ERROR',
      'No se puede eliminar o desactivar al único administrador activo.',
      FEATURE,
    )
  }
}

export async function listUsuariosMock(): Promise<Usuario[]> {
  return usuarioSchema.array().parse(mockDb.usuarios)
}

export async function getUsuarioMock(id: string): Promise<Usuario> {
  const usuario = mockDb.usuarios.find((u) => u.id === id)
  if (!usuario) {
    throw new AppError('NOT_FOUND', `Usuario con id ${id} no encontrado`, FEATURE)
  }
  return usuarioSchema.parse(usuario)
}

export async function createUsuarioMock(
  input: CreateUsuarioInput,
): Promise<Usuario> {
  const data = createUsuarioInputSchema.parse(input)

  const emailExists = mockDb.usuarios.some(
    (u) => u.email.toLowerCase() === data.email.toLowerCase(),
  )
  if (emailExists) {
    throw new AppError(
      'VALIDATION_ERROR',
      'Ya existe un usuario con ese correo electrónico.',
      FEATURE,
    )
  }

  const usuario: Usuario = {
    id: crypto.randomUUID(),
    email: data.email.toLowerCase(),
    nombre: data.nombre,
    rol: data.rol,
    estatus: data.estatus,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  mockDb.usuarios.unshift(usuario)
  return usuario
}

export async function updateUsuarioMock(
  id: string,
  input: UsuarioInput,
): Promise<Usuario> {
  const index = mockDb.usuarios.findIndex((u) => u.id === id)
  if (index === -1) {
    throw new AppError('NOT_FOUND', `Usuario con id ${id} no encontrado`, FEATURE)
  }

  const data = usuarioInputSchema.parse(input)
  const current = mockDb.usuarios[index]

  const emailTaken = mockDb.usuarios.some(
    (u) => u.id !== id && u.email.toLowerCase() === data.email.toLowerCase(),
  )
  if (emailTaken) {
    throw new AppError(
      'VALIDATION_ERROR',
      'Ya existe otro usuario con ese correo electrónico.',
      FEATURE,
    )
  }

  if (current.rol === ROLES.ADMIN && data.rol !== ROLES.ADMIN) {
    assertNotLastAdmin(id)
  }
  if (current.rol === ROLES.ADMIN && data.estatus !== 'activo') {
    assertNotLastAdmin(id)
  }

  const updated: Usuario = {
    ...current,
    ...data,
    email: data.email.toLowerCase(),
    id,
    updatedAt: new Date(),
  }
  mockDb.usuarios[index] = updated
  return updated
}

export async function deleteUsuarioMock(
  id: string,
  currentUserId?: string,
): Promise<void> {
  if (currentUserId && id === currentUserId) {
    throw new AppError(
      'VALIDATION_ERROR',
      'No puedes eliminar tu propia cuenta.',
      FEATURE,
    )
  }

  const index = mockDb.usuarios.findIndex((u) => u.id === id)
  if (index === -1) {
    throw new AppError('NOT_FOUND', `Usuario con id ${id} no encontrado`, FEATURE)
  }

  assertNotLastAdmin(id)
  mockDb.usuarios.splice(index, 1)
}

export async function changeUsuarioPasswordMock(
  id: string,
  input: CambiarContrasenaInput,
): Promise<void> {
  cambiarContrasenaInputSchema.parse(input)
  const exists = mockDb.usuarios.some((u) => u.id === id)
  if (!exists) {
    throw new AppError('NOT_FOUND', `Usuario con id ${id} no encontrado`, FEATURE)
  }
}
