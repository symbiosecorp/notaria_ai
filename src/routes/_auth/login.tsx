import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '#/components/ui/field'
import { toFieldErrors } from '#/lib/forms'
import { useAuth } from '#/lib/auth/auth-context'
import { loginInputSchema } from '#/lib/auth/schemas.ts'
import { APP_SHORT_NAME } from '#/lib/config/app'
import type { LoginInput } from '#/lib/auth/schemas.ts'

export const Route = createFileRoute('/_auth/login')({
  component: LoginPage,
})

const emptyValues: LoginInput = {
  email: '',
  password: '',
}

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: async (result) => {
      if (!result.ok) {
        toast.error(result.message)
        return
      }
      await navigate({ to: '/dashboard' })
    },
    onError: () => {
      toast.error('No se pudo iniciar sesión. Inténtalo de nuevo.')
    },
  })

  const form = useForm({
    defaultValues: emptyValues,
    validators: { onSubmit: loginInputSchema },
    onSubmit: async ({ value }) => {
      await loginMutation.mutateAsync(loginInputSchema.parse(value))
    },
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex size-10 items-center justify-center rounded-md bg-lagoon text-white">
          <span className="font-bold">N1</span>
        </div>
        <h1 className="text-2xl font-bold">{APP_SHORT_NAME}</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Ingresa tus credenciales para continuar
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              void form.handleSubmit()
            }}
          >
            <FieldGroup>
              <form.Field name="email">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="notario@ejemplo.com"
                      autoComplete="email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                  </Field>
                )}
              </form.Field>
              <form.Field name="password">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                  </Field>
                )}
              </form.Field>
              <Button type="submit" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? 'Entrando...' : 'Iniciar sesión'}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <p className="text-center text-sm text-muted-foreground">
        El acceso lo asigna la administración de la notaría.
      </p>
    </div>
  )
}
