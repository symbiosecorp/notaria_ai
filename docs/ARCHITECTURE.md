# Arquitectura — Base / Esqueleto del Front NOTARIA IA

## Objetivo

Esta entrega deja una **base arquitectónica escalable y mantenible**: un esqueleto navegable de extremo a extremo donde agregar un módulo o localizar un bug sea trivial y predecible. La prioridad es *"saber exactamente dónde está el problema y solucionarlo rápido"*.

## Alcance

- Todos los módulos del RFP existen como **placeholders navegables**.
- El módulo **Clientes** es el **ejemplo vivo** del patrón modular: schema → service mock → hook → página lista mínima funcional.
- Los datos son **mock en memoria** (faker) detrás de una capa de servicios por feature.
- No se incluyen CRUD/forms/detalle completos, backend real, IA real, 2FA ni integraciones externas.

## Principio rector: arquitectura por features

```
src/
  routes/          # Cableado fino de rutas (file-based TanStack Router)
  features/        # Lógica de negocio por dominio
  components/        # UI compartida (layout, common, primitives shadcn)
  lib/             # Utilidades, config, auth, errores, API
  stores/          # Estado global UI y auth con TanStack Store
```

Flujo de datos:

```
Componente → hook (TanStack Query) → service (*.service.ts) → mock-db / API real
```

Cambiar de mock a backend real implica reescribir **solo** el `*.service.ts` correspondiente.

## Estructura detallada

### Rutas (`src/routes/`)

| Archivo | Responsabilidad |
| --- | --- |
| `__root.tsx` | Layout raíz, metadatos, providers globales (TooltipProvider). |
| `index.tsx` | Redirect `/` → `/dashboard`. |
| `_auth.tsx` | Layout público (card centrada). |
| `_auth/login.tsx` | Formulario de login. |
| `_auth/registro.tsx` | Formulario de registro. |
| `_app.tsx` | Layout autenticado (`AppShell`) + guard `beforeLoad`. |
| `_app/dashboard.tsx` | Dashboard con resumen de módulos. |
| `_app/clientes/index.tsx` | Lista de clientes (ejemplo vivo). |
| `_app/clientes/$clienteId.tsx` | Placeholder de detalle. |
| `_app/{expedientes,honorarios,...}.tsx` | Placeholders de cada módulo. |

Las rutas no contienen lógica de negocio; solo importan componentes y hooks de sus features.

### Features (`src/features/`)

#### Clientes (feature de referencia)

```
features/clientes/
  schemas.ts              # Zod schemas + tipos inferidos
  api/clientes.service.ts # contrato + implementación mock
  hooks/use-clientes.ts   # queryOptions de TanStack Query
  components/clientes-table.tsx
  index.ts                # barrel
```

#### Template (`features/_template/`)

Carpeta documentada para clonar módulos nuevos. Ver `src/features/_template/README.md`.

### Componentes compartidos (`src/components/`)

- `ui/` — primitives shadcn (button, card, sidebar, table, etc.).
- `layout/` — `AppShell`, `NavSidebar`, `Topbar`, `AppBreadcrumbs`, `UserMenu`.
- `common/` — `PageHeader`, `ModulePlaceholder`, `EmptyState`, `DataTable`.

### Infraestructura (`src/lib/` y `src/stores/`)

| Archivo | Responsabilidad |
| --- | --- |
| `lib/config/modules.ts` | Registro único de módulos (sidebar, breadcrumbs, permisos). |
| `lib/config/app.ts` | Constantes de la aplicación. |
| `lib/api/mock-db.ts` | Store en memoria + seed con faker. |
| `lib/api/query-client.ts` | Configuración de `QueryClient`. |
| `lib/auth/auth-context.tsx` | `useAuth()` (lee del store). |
| `lib/auth/guard.ts` | `requireAuth()` y `requirePermission()`. |
| `lib/auth/permissions.ts` | Roles y permisos base. |
| `lib/errors/app-error.ts` | Clase `AppError` tipada. |
| `lib/errors/logger.ts` | `createLogger(feature)` con tag. |
| `lib/errors/error-boundary.tsx` | Boundary reutilizable por ruta. |
| `stores/auth-store.ts` | Estado de sesión (TanStack Store). |
| `stores/ui-store.ts` | Estado UI global: sidebar, tema. |

## Piezas clave

### 1. Registro de módulos

`src/lib/config/modules.ts` define `modules` con `{ id, label, path, icon, group, permission }`. El sidebar, breadcrumbs y el scaffold de permisos se generan de aquí.

### 2. AppShell y navegación

`AppShell` (`components/layout/app-shell.tsx`) combina:

- `SidebarProvider` + `NavSidebar` (responsive, usa shadcn sidebar + Sheet en móvil).
- `Topbar` con toggle de sidebar, breadcrumbs y toggle de tema.
- `UserMenu` con dropdown de cuenta y logout.

### 3. Capa de datos mock

`mockDb` (`src/lib/api/mock-db.ts`) siembra clientes con faker. Cada `*.service.ts` expone funciones async tipadas (`listClientes`, `getCliente`, ...). Los hooks (`use-clientes.ts`) envuelven con `queryOptions` de TanStack Query para cache, loaders y devtools.

### 4. Schema-first con Zod

Cada entidad define su Zod schema en `features/<modulo>/schemas.ts`. Los tipos se infieren (`z.infer`).

### 5. Manejo de errores + logging

`AppError` etiqueta cada error con `code`, `feature` y `timestamp`. `createLogger` agrega un tag de feature a cada log. `AppErrorBoundary` se monta por ruta vía `errorComponent`.

### 6. Auth + RBAC scaffold

El estado de sesión está en `authStore` (`src/stores/auth-store.ts`). `requireAuth()` se usa en el `beforeLoad` de `_app.tsx`. Los permisos base están en `permissions.ts` y se conectarán a 2FA/JWT en entregas posteriores.

### 7. Tema

`uiStore` (`src/stores/ui-store.ts`) gestiona el tema (light/dark/system) y el estado del sidebar. `AppShell` inicializa el tema en un `useEffect`.

## Verificación

- `pnpm exec tsc --noEmit` — tipos correctos.
- `pnpm lint` — lint limpio.
- `pnpm generate-routes` — árbol de rutas actualizado.
- `pnpm dev` — navegación manual:
  - `/` redirige a `/dashboard`.
  - Sin sesión redirige a `/login`.
  - Login mock entra al shell.
  - Sidebar navega a cada módulo.
  - `/clientes` muestra lista sembrada con faker.
  - Breadcrumbs y tema funcionan.

## Fuera de alcance (entregas siguientes)

CRUD/forms/detalle completos de Clientes y demás módulos, integración IA real, backend/API real, 2FA, calculadora del Arancel, generación documental Word, integración SAT.
