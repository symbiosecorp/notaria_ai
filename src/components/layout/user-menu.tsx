import { LogOut, User } from "lucide-react"
import { Link, useNavigate } from "@tanstack/react-router"
import { Avatar, AvatarFallback } from "#/components/ui/avatar"
import { Button } from "#/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"
import { useAuth } from "#/lib/auth/auth-context"
import { useSidebar } from "#/components/ui/sidebar"

export function UserMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { isMobile } = useSidebar()

  if (!user) return null

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const handleLogout = () => {
    logout()
    navigate({ to: "/login" })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 px-2 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
        >
          <Avatar className="size-7">
            <AvatarFallback className="bg-lagoon text-xs text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium leading-none">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.role}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" side={isMobile ? "top" : "right"}>
        <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/configuracion">
            <User className="size-4" />
            Configuración
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="size-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
