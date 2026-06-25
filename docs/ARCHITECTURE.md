# Arquitectura — Front NOTARIA IA

Referencia detallada de cómo está organizado el proyecto y cómo extenderlo sin romper la
estructura. Para las reglas cortas del día a día ver `CLAUDE.md`; para qué es el proyecto y
cómo correrlo ver `README.md`.

## Objetivo de diseño

Una base **escalable y mantenible** donde agregar un módulo o localizar un bug sea
predecible: *"saber exactamente dónde está el problema y solucionarlo rápido"*. Esto se
logra con **aislamiento por features** y un **flujo de datos en capas** unidireccional.

## Principio rector: arquitectura por features

```
src/
  routes/        # Cableado fino de rutas (file-based TanStack Router). Sin lógica de negocio.
  features/      # Lógica de negocio por dominio (un módulo = una carpeta autocontenida).
  components/    # UI compartida: ui/ (shadcn), layout/, common/.
  lib/           # Infraestructura: config, api, auth, errores, helpers.
  stores/        # Estado global con TanStack Store (auth, tema).
```

Flujo de datos (una sola dirección):

```
componente → hook (TanStack Query) → service (*.service.ts) → mock-db / API real
```

Migrar de mock a backend real = reescribir **solo** el `*.service.ts` del feature; los
hooks, componentes y rutas no se enteran.

## Anatomía de un feature

Cada módulo en `src/features/<modulo>/` tiene:

```
features/<modulo>/
  schemas.ts                 # Zod schemas (entidad + input) + enums/labels + tipos inferidos
  api/<modulo>.service.ts    # Contrato de negocio: list/get/create/update/delete (mock hoy)
  hooks/use-<modulo>.ts      # queryOptions + mutaciones (useMutation que invalidan keys)
  components/                # UI propia del dominio (tabla, formulario, badges…)
  index.ts                   # barrel: superficie pública del feature
```

Módulos funcionales actuales: **clientes**, **expedientes**, **honorarios**. El feature
**clientes** es el ejemplo de referencia más limpio. `features/_template/` es la plantilla
documentada para clonar (ver su `README.md`).

### Schemas (Zod)

- La **entidad** (`clienteSchema`) modela el registro completo (con `id`, `createdAt`, …).
  Usa `z.coerce.date()` para tolerar fechas como string desde una API real.
- El **input** (`clienteInputSchema`) es lo que captura el formulario: `omit` de los campos
  generados. **No lleva `.default()`** (los defaults los pone el form), para que el tipo de
  entrada del validador coincida con el form data en TanStack Form. Si un campo de fecha usa
  `z.coerce.date()` en la entidad, sobrescríbelo a `z.date()` en el input (ver expedientes).
- Los tipos se infieren con `z.infer`. Los `Record<Enum, string>` de labels viven junto al
  enum y se reutilizan en tabla/detalle/formulario.

### Service (capa de datos)

- Funciones async tipadas; `await delay()` simula latencia.
- **Validan en el límite** con `schema.array().parse(...)` / `schema.parse(...)`.
- Lanzan `AppError('NOT_FOUND', …, '<feature>')` cuando corresponde.
- Mutan `mockDb` (in-memory); IDs nuevos con `crypto.randomUUID()`; folios autogenerados.

### Hooks

- `<modulo>Keys` (factory de query keys), `<modulo>ListOptions()` / `<modulo>ByIdOptions(id)`
  con `queryOptions`, y mutaciones (`useCreate*/useUpdate*/useDelete*`) que invalidan
  `<modulo>Keys.all` en `onSuccess`.

### Formularios (TanStack Form + Zod)

Patrón (ver `cliente-form.tsx`):

```tsx
const form = useForm({
  defaultValues: { ...emptyValues, ...defaultValues },
  validators: { onSubmit: clienteInputSchema },
  onSubmit: async ({ value }) => { await onSubmit(clienteInputSchema.parse(value)) },
})
// <form.Field name="…">{(field) => (<Input value={field.state.value}
//   onChange={(e) => field.handleChange(e.target.value)} />)}</form.Field>
// Conditional/derived UI: <form.Subscribe selector={(s) => s.values.x}>{…}</form.Subscribe>
```

- Campos de **fecha/número** convierten en el `onChange` (el input entrega string).
- Campos **derivados** (ej. `clienteNombre` a partir de `clienteId`) se calculan en
  `onSubmit` antes de `parse`.
- Errores por campo: `toFieldErrors(field.state.meta.errors)` de `#/lib/forms` →
  `<FieldError errors={…} />`.

## Rutas (`src/routes/`)

File-based. Estructura por módulo bajo el layout autenticado `_app`:

```
_app/<modulo>/
  index.tsx          # lista (loader: ensureQueryData de la lista; búsqueda en cliente)
  $<id>.tsx          # detalle (loader del item; borrar vía ConfirmDialog + toast)
  nuevo.tsx          # alta (formulario del feature)
  $<id>.editar.tsx   # edición (carga item + dependencias; defaultValues al form)
```

Convenciones de ruta:

- Loaders: `loader: ({ context }) => context.queryClient.ensureQueryData(<opts>)`. Si
  necesitas varias fuentes, `Promise.all([...])`.
- Boundary por ruta: `errorComponent: (props) => <AppErrorBoundary {...props} feature="<modulo>" />`.
- `index.tsx` redirige `/` → `/dashboard`. `_auth/*` son rutas públicas (login/registro).

## Componentes compartidos (`src/components/`)

- `ui/` — primitives shadcn (button, card, table, select, field, sidebar, alert-dialog, …).
- `layout/` — `AppShell`, `NavSidebar`, `Topbar`, `AppBreadcrumbs`, `UserMenu`.
- `common/` — `PageHeader`, `EmptyState`, `DataTable`, `ModulePlaceholder`,
  **`ConfirmDialog`** (diálogo de confirmación reutilizable; reemplaza a `window.confirm`).

## Infraestructura (`src/lib/` y `src/stores/`)

| Archivo | Responsabilidad |
| --- | --- |
| `lib/config/modules.ts` | Registro único de módulos (sidebar, breadcrumbs, permisos). |
| `lib/config/app.ts` | Constantes de la app (nombre, versión). |
| `lib/api/mock-db.ts` | Store en memoria (clientes, expedientes, cotizaciones) + seed con faker. |
| `lib/api/query-client.ts` | `createQueryClient()` (nuevo por request, evita fuga SSR). |
| `lib/auth/auth-context.tsx` | `useAuth()` (lee del store). |
| `lib/auth/guard.ts` | `requireAuth()` / `requirePermission()` (SSR-safe; reciben `context.auth`). |
| `lib/auth/permissions.ts` | Roles y permisos base (RBAC scaffold). |
| `lib/errors/app-error.ts` | Clase `AppError` tipada por feature. |
| `lib/errors/logger.ts` | `createLogger(feature)` (usa `import.meta.env.VITE_LOG_LEVEL`). |
| `lib/errors/error-boundary.tsx` | `AppErrorBoundary` por ruta. |
| `lib/format.ts` | `formatDate`, `formatCurrency` (MXN). |
| `lib/forms.ts` | `toFieldErrors` (adapta errores de TanStack Form a `FieldError`). |
| `stores/auth-store.ts` | Sesión mock (TanStack Store) persistida en `localStorage`. |
| `stores/ui-store.ts` | Tema (light/dark/system). |

### Wiring de la app

- `src/router.tsx` crea el router e inyecta el **contexto** (`queryClient`, `auth`) y conecta
  SSR + Query (`setupRouterSsrQueryIntegration`).
- `src/routes/__root.tsx` define el documento raíz, metadatos, `TooltipProvider` y devtools.
- La sesión es mock y client-side: `requireAuth` se omite en SSR (el cliente es la
  autoridad). Con auth real se moverá a cookies legibles en el servidor.

## Honorarios: motor de arancel

`features/honorarios/api/arancel.ts` calcula el honorario (tabulador progresivo por valor +
cuotas fijas en UMAs por artículo, IVA, descuentos/recargos). `ARANCEL_CONFIG` (UMA, IVA) y
los tabuladores son **ilustrativos**: hay que cargar los valores reales de la Ley del Arancel
de Puebla. El service usa el motor para derivar los importes de cada cotización.

## Cómo agregar un módulo

1. Copia `src/features/_template/` a `src/features/<modulo>/`.
2. Reemplaza `template` por `<modulo>` en archivos, funciones y tipos.
3. Define `schemas.ts` (entidad + input; sin `.default()` en el input).
4. Implementa `api/<modulo>.service.ts` (CRUD contra `mockDb`; agrega la colección en
   `lib/api/mock-db.ts` y siémbrala).
5. Crea `hooks/use-<modulo>.ts` (`queryOptions` + mutaciones).
6. Crea `components/` (tabla + formulario con TanStack Form) y el `index.ts` (barrel).
7. Regístralo en `src/lib/config/modules.ts`.
8. Crea las rutas en `src/routes/_app/<modulo>/` (index/detalle/nuevo/editar).
9. `pnpm generate-routes`, luego `pnpm exec tsc --noEmit` y `pnpm lint`.

## Verificación

- `pnpm exec tsc --noEmit` y `pnpm lint` limpios.
- `pnpm dev`: login mock → sidebar navega a cada módulo; Clientes/Expedientes/Honorarios
  permiten listar, ver detalle, crear, editar y eliminar (con `ConfirmDialog`); la
  calculadora de honorarios muestra el desglose en vivo.

## Pendiente (entregas siguientes)

Backend/API real, integración IA, 2FA, valores reales del arancel, generación documental
Word, integración SAT, módulos restantes del RFP (documental, registro público, fiscal,
UIF, agenda, reportes).
