import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { getContext } from './integrations/tanstack-query/root-provider'
import { auth } from '#/stores/auth-store'

export function getRouter() {
  const context = {
    ...getContext(),
    auth,
  }

  const router = createTanStackRouter({
    routeTree,
    context,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: ({ error }) => (
      <div className="p-8">
        <h1 className="text-xl font-bold text-destructive">Error</h1>
        <pre className="mt-4 text-sm">{JSON.stringify(error, null, 2)}</pre>
      </div>
    ),
  })

  setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
