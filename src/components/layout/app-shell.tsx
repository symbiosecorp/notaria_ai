import { useEffect } from "react"
import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar"
import { NavSidebar } from "./nav-sidebar"
import { Topbar } from "./topbar"
import { initializeTheme } from "#/stores/ui-store"

export function AppShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeTheme()
  }, [])

  return (
    <SidebarProvider>
      <NavSidebar />
      <SidebarInset className="flex min-h-svh flex-col">
        <Topbar />
        <main className="flex-1 p-4 md:p-6">
          <div className="page-wrap">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
