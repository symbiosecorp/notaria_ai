import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppShell } from '#/components/layout/app-shell'
import { requireAuth } from '#/lib/auth/guard'

export const Route = createFileRoute('/_app')({
  component: AppLayout,
  beforeLoad: ({ context }) => {
    requireAuth(context.auth)
  },
})

function AppLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
