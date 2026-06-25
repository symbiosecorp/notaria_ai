import { Link, useLocation } from "@tanstack/react-router"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "#/components/ui/breadcrumb"
import { modulesById } from "#/lib/config/modules"

export function AppBreadcrumbs() {
  const { pathname } = useLocation()
  const segments = pathname.split("/").filter(Boolean)

  const crumbs = segments.map((segment, index) => {
    const path = "/" + segments.slice(0, index + 1).join("/")
    const moduleConfig = Object.values(modulesById).find(
      (m) => m.path === path || path.startsWith(m.path + "/"),
    )
    const label = moduleConfig?.label || segment.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())
    return { path, label, isLast: index === segments.length - 1 }
  })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/dashboard">Inicio</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {crumbs.length > 0 && <BreadcrumbSeparator />}
        {crumbs.map((crumb, index) => (
          <BreadcrumbItem key={crumb.path}>
            {crumb.isLast ? (
              <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link to={crumb.path}>{crumb.label}</Link>
              </BreadcrumbLink>
            )}
            {index < crumbs.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
