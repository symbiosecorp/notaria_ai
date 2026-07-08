import { Link, useLocation } from "@tanstack/react-router"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "#/components/ui/sidebar"
import { APP_NAME } from "#/lib/config/app"
import { moduleGroups, modules } from "#/lib/config/modules"
import { useAuth } from "#/lib/auth/auth-context"
import { hasPermission } from "#/lib/auth/permissions.ts"
import type { Permission } from "#/lib/auth/permissions.ts"
import { UserMenu } from "./user-menu"
import { ScrollArea } from "#/components/ui/scroll-area"

function SidebarLink({
  to,
  label,
  icon: Icon,
}: {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}) {
  const { pathname } = useLocation()
  const { isMobile, setOpenMobile } = useSidebar()
  const isActive = pathname === to || pathname.startsWith(`${to}/`)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
        <Link
          to={to}
          onClick={() => {
            if (isMobile) setOpenMobile(false)
          }}
        >
          <Icon className="size-4" />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function NavSidebar() {
  const { user } = useAuth()
  const role = user?.role

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-lagoon text-white">
            <span className="text-xs font-bold">N1</span>
          </div>
          <span className="font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            {APP_NAME}
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          {moduleGroups.map((group) => {
            const groupModules = modules.filter(
              (m) =>
                m.group === group.id &&
                role &&
                hasPermission(role, m.permission as Permission),
            )
            if (groupModules.length === 0) return null
            return (
              <SidebarGroup key={group.id}>
                <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
                  {group.label}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {groupModules.map((module) => (
                      <SidebarLink
                        key={module.id}
                        to={module.path}
                        label={module.label}
                        icon={module.icon}
                      />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )
          })}
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <UserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
