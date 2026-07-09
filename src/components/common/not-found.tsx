import { Link } from '@tanstack/react-router'
import { Compass } from 'lucide-react'
import { Button } from '#/components/ui/button'

export function NotFound() {
  return (
    <div className="flex min-h-[60svh] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-lagoon/15">
        <Compass className="size-6 text-lagoon-deep" />
      </div>
      <h1 className="display-title text-2xl font-bold tracking-tight text-sea-ink">
        Página no encontrada
      </h1>
      <p className="max-w-sm text-sm text-sea-ink-soft">
        La dirección que buscas no existe o fue movida. Verifica el enlace o
        vuelve al inicio.
      </p>
      <Button asChild>
        <Link to="/">Ir al inicio</Link>
      </Button>
    </div>
  )
}
