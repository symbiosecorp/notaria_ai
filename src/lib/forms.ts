/**
 * Normaliza los errores de un campo de TanStack Form al formato que espera el
 * componente `FieldError` de shadcn (`Array<{ message?: string }>`). Los
 * validadores Standard Schema (Zod) devuelven objetos con `.message`, pero un
 * validador manual podría devolver strings.
 */
export function toFieldErrors(
  errors: ReadonlyArray<unknown>,
): Array<{ message?: string }> {
  return errors.map((error) =>
    typeof error === 'string'
      ? { message: error }
      : (error as { message?: string }),
  )
}
