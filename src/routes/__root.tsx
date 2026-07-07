import {
  HeadContent,
  Link,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'
import { APP_DESCRIPTION, APP_NAME } from '#/lib/config/app'
import { TooltipProvider } from '#/components/ui/tooltip'
import { Button } from '#/components/ui/button'

import type { QueryClient } from '@tanstack/react-query'
import type { auth } from '#/stores/auth-store'

interface MyRouterContext {
  queryClient: QueryClient
  auth: typeof auth
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: APP_NAME,
      },
      {
        name: 'description',
        content: APP_DESCRIPTION,
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-sm font-medium text-lagoon">Error 404</p>
      <h1 className="text-2xl font-semibold text-sea-ink">
        Página no encontrada
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        La página que buscas no existe o fue movida.
      </p>
      <Button asChild className="mt-2">
        <Link to="/dashboard">Volver al inicio</Link>
      </Button>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        <TooltipProvider delayDuration={0}>
          {children}
        </TooltipProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
