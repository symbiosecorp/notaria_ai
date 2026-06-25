import { PanelLeft, Sun, Moon, Monitor } from "lucide-react"
import { Button } from "#/components/ui/button"
import { SidebarTrigger } from "#/components/ui/sidebar"
import { AppBreadcrumbs } from "./breadcrumbs"
import { uiStore, setTheme  } from "#/stores/ui-store"
import type {Theme} from "#/stores/ui-store";
import { useStore } from "@tanstack/react-store"

const themeOptions: { value: Theme; icon: React.ReactNode; label: string }[] = [
  { value: "light", icon: <Sun className="size-4" />, label: "Claro" },
  { value: "dark", icon: <Moon className="size-4" />, label: "Oscuro" },
  { value: "system", icon: <Monitor className="size-4" />, label: "Sistema" },
]

export function Topbar() {
  const theme = useStore(uiStore, (state) => state.theme)

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-header-bg/80 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-header-bg/60">
      <SidebarTrigger className="md:hidden">
        <PanelLeft className="size-4" />
        <span className="sr-only">Abrir menú</span>
      </SidebarTrigger>
      <div className="flex flex-1 items-center justify-between">
        <AppBreadcrumbs />
        <div className="flex items-center gap-1">
          {themeOptions.map((option) => (
            <Button
              key={option.value}
              variant={theme === option.value ? "secondary" : "ghost"}
              size="icon"
              className="size-8"
              onClick={() => setTheme(option.value)}
              title={option.label}
            >
              {option.icon}
            </Button>
          ))}
        </div>
      </div>
    </header>
  )
}
