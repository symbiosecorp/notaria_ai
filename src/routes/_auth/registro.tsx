import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { useAuth } from '#/lib/auth/auth-context'
import { APP_SHORT_NAME } from '#/lib/config/app'

export const Route = createFileRoute('/_auth/registro')({
  component: RegistroPage,
})

function RegistroPage() {
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') || '')
    const password = String(formData.get('password') || '')
    await login(email, password)
    navigate({ to: '/dashboard' })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex size-10 items-center justify-center rounded-md bg-lagoon text-white">
          <span className="font-bold">N1</span>
        </div>
        <h1 className="text-2xl font-bold">Crear cuenta en {APP_SHORT_NAME}</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Completa el formulario para solicitar acceso
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="notario@ejemplo.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creando...' : 'Crear cuenta'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="underline underline-offset-4">
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
