import { AppError, isAppError } from '#/lib/errors/app-error.ts'
import type { AuthError, PostgrestError } from '@supabase/supabase-js'

/** Re-lanza AppError; envuelve el resto como SERVICE_ERROR. */
export function rethrowAsAppError(error: unknown, feature: string): never {
  if (isAppError(error)) throw error
  const message =
    error instanceof Error ? error.message : 'Error inesperado del servidor.'
  throw new AppError('SERVICE_ERROR', message, feature, error)
}

export function mapPostgrestError(
  error: PostgrestError,
  feature: string,
): AppError {
  if (error.code === 'PGRST116') {
    return new AppError('NOT_FOUND', 'Registro no encontrado.', feature, error)
  }
  if (error.code === '23505') {
    return new AppError(
      'VALIDATION_ERROR',
      'Ya existe un registro con esos datos.',
      feature,
      error,
    )
  }
  return new AppError('SERVICE_ERROR', error.message, feature, error)
}

export function mapAuthAdminError(error: AuthError, feature: string): AppError {
  if (error.message.includes('already been registered')) {
    return new AppError(
      'VALIDATION_ERROR',
      'Ya existe un usuario con ese correo electrónico.',
      feature,
      error,
    )
  }
  return new AppError('SERVICE_ERROR', error.message, feature, error)
}
