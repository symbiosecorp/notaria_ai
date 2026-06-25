# Plan — Base / Esqueleto del Front NOTARIA IA

> Documento de revisión. Nada de esto está implementado todavía.

## Contexto

La Notaría Pública No. 1 de Tetela de Ocampo (Puebla) necesita una plataforma web
integral (RFP en `docs/RFP.md`) que funcione como "sistema operativo" de la notaría:
11+ módulos (Clientes, Expedientes, Honorarios, Documental, Registro Público, Fiscal,
UIF/PLD, Agenda, Reportes, IA, Seguridad/Config).

El objetivo de **esta entrega** no es construir módulos completos, sino dejar una
**base arquitectónica escalable y mantenible**: un esqueleto navegable de extremo a
extremo donde agregar un módulo o localizar un bug sea trivial y predecible. La
prioridad explícita: *"saber exactamente dónde está el problema y solucionarlo rápido"*.

Decisiones ya tomadas:
- **Alcance:** solo la base / esqueleto (todos los módulos como placeholders navegables).
- **Módulo de referencia:** Clientes — se deja como *ejemplo vivo* del patrón modular
  (capas completas: schema → service mock → hook → página lista mínima funcional),
  sin CRUD/forms/detalle completos.
- **Datos:** mock en memoria (faker) detrás de una **capa de servicios** por módulo, de
  modo que cambiar a un backend real = tocar solo esa capa, sin tocar componentes.

Estado actual: scaffold limpio de TanStack Start (Router file-based, Query, DB, Form,
Table, Store, adaptadores IA), shadcn (estilo new-york, lucide, base zinc), design
system "ocean/island" ya en `src/styles.css`, pnpm, alias `#/*` y `@/*` → `src/*`.

## Principio rector: arquitectura por features (modular)

Cada módulo del RFP = una carpeta autocontenida en `src/features/<modulo>/`. Las rutas
(`src/routes/`) son **solo cableado fino**; toda la lógica vive en su feature. Un
problema en "honorarios" vive entero en `features/honorarios/`. Flujo de datos en capas
estricto y unidireccional:

```
Componente  →  hook (TanStack Query)  →  service (*.service.ts)  →  api client / mock-db
   UI            cache + estado            contrato de negocio        fuente de datos
```

Cambiar mock → backend real = reescribir solo `*.service.ts`. Nada más se entera.

## Estructura objetivo

```
src/
  routes/                       # Cableado de rutas (thin). File-based.
    __root.tsx                  # (existe) — ajustar título/meta a NOTARIA IA
    index.tsx                   # redirect → /dashboard
    _auth.tsx                   # layout público (card centrada, sin app shell)
    _auth/
      login.tsx                 # usa <LoginForm> existente
      registro.tsx              # usa <SignupForm> existente
    _app.tsx                    # layout autenticado: <AppShell> + guard (beforeLoad)
    _app/
      dashboard.tsx
      clientes/
        index.tsx               # lista (ejemplo vivo, lee de mock)
        $clienteId.tsx          # placeholder detalle
      expedientes.tsx           # placeholder
      honorarios.tsx            # placeholder
      documental.tsx            # placeholder
      registro-publico.tsx      # placeholder
      fiscal.tsx                # placeholder
      uif.tsx                   # placeholder
      agenda.tsx                # placeholder
      reportes.tsx              # placeholder
      ia.tsx                    # placeholder
      configuracion.tsx         # placeholder (usuarios/roles/bitácora)

  features/                     # Lógica de negocio por dominio
    clientes/                   # ← REFERENCIA completa del patrón
      components/               # UI propia (ej. ClientesTable)
      api/clientes.service.ts   # contrato + impl mock
      hooks/use-clientes.ts     # wrappers de TanStack Query (queryOptions)
      schemas.ts                # Zod schemas + tipos inferidos
      index.ts                  # barrel: superficie pública del feature
    _template/                  # carpeta-plantilla documentada para clonar módulos
    (expedientes, honorarios, ... se crean cuando se construyan)

  components/
    ui/                         # primitives shadcn (existentes + nuevos)
    layout/                     # AppShell, Sidebar, Topbar, Breadcrumbs, UserMenu
    common/                     # PageHeader, ModulePlaceholder, EmptyState, DataTable

  lib/
    utils.ts                    # (existe) cn()
    api/
      mock-db.ts                # store en memoria + seed con faker
      query-client.ts           # (opcional) defaults de QueryClient
    auth/
      auth-context.tsx          # estado de sesión (mock) + useAuth()
      guard.ts                  # requireAuth() para beforeLoad
      permissions.ts            # roles/permisos (scaffold RBAC, RFP §7)
    config/
      modules.ts                # ★ REGISTRO de módulos (única fuente de verdad)
      app.ts                    # nombre app, constantes (UMA, etc. a futuro)
    errors/
      app-error.ts              # clase AppError tipada
      logger.ts                 # logger estructurado con tag de feature
      error-boundary.tsx        # boundary reutilizable por ruta

  stores/
    ui-store.ts                 # estado UI global (sidebar, tema) con TanStack Store
```

## Piezas clave (y por qué ayudan a mantener/depurar)

1. **Registro de módulos** (`lib/config/modules.ts`): array tipado con `{ id, label,
   path, icon, group, permission }`. El Sidebar, los breadcrumbs y el guard de permisos
   se **generan** de aquí. Agregar un módulo = 1 entrada + 1 archivo de ruta.

2. **AppShell** (`components/layout/`): Sidebar (responsive, usa el bloque `sidebar` de
   shadcn + Sheet en móvil), Topbar con breadcrumbs + UserMenu + toggle de tema. Cumple
   RFP §3 (Windows/tablet/móvil).

3. **Capa de datos mock** (`lib/api/mock-db.ts` + `features/*/api/*.service.ts`):
   `mock-db` siembra datos con `@faker-js/faker` (ya instalado). Cada service expone
   funciones async tipadas (`listClientes`, `getCliente`, ...) que hoy leen del mock y
   mañana harán `fetch`. Los hooks (`use-clientes.ts`) envuelven con `queryOptions` de
   TanStack Query para cache, loaders de ruta y devtools.

4. **Schema-first con Zod** (`features/*/schemas.ts`): cada entidad define su Zod schema;
   los tipos se infieren (`z.infer`). Validación en los límites (forms, respuestas API).

5. **Manejo de errores + logging** (`lib/errors/`): `AppError` tipada, `logger` con tag
   por feature, y `ErrorBoundary` montado por ruta vía `errorComponent`. Esto materializa
   "saber exactamente dónde está el problema": cada error queda etiquetado por módulo.

6. **Auth + RBAC scaffold** (`lib/auth/`): contexto de sesión mock, `requireAuth()` en
   `beforeLoad` de `_app.tsx` (redirige a `/login`), y `permissions.ts` con roles base
   (RFP §7: usuarios/roles/permisos). Mock ahora; punto único para conectar 2FA/JWT luego.

7. **Documentación de convenciones**: `CLAUDE.md` (raíz) + `docs/ARCHITECTURE.md`
   describiendo dónde va cada cosa y cómo clonar `features/_template/` para un módulo
   nuevo. Garantiza consistencia a mediano/largo plazo.

## Componentes shadcn a agregar

Vía `pnpm dlx shadcn@latest add <c>` (respeta `.cursorrules`): `sidebar`, `breadcrumb`,
`dropdown-menu`, `avatar`, `badge`, `table`, `tooltip`, `sheet`, `skeleton`, `sonner`,
`scroll-area`. (Ya existen: button, input, label, select, slider, switch, textarea,
card, field, separator.)

## Pasos de implementación

1. **Infra base**: `lib/config/modules.ts`, `lib/config/app.ts`, `lib/errors/*`,
   `stores/ui-store.ts`, `lib/auth/*`. Agregar componentes shadcn.
2. **Layout/Shell**: `components/layout/` (AppShell, Sidebar, Topbar, Breadcrumbs,
   UserMenu) + `components/common/` (PageHeader, ModulePlaceholder, EmptyState, DataTable).
3. **Rutas**: `_auth.tsx`+`_auth/{login,registro}.tsx`, `_app.tsx`+`_app/*` (dashboard +
   placeholders de todos los módulos), `index.tsx` redirect. Ajustar `__root.tsx`.
4. **Feature de referencia Clientes**: `features/clientes/{schemas.ts, api/clientes.service.ts,
   hooks/use-clientes.ts, components/, index.ts}` + `lib/api/mock-db.ts` con seed; la
   ruta `_app/clientes/index.tsx` consume el hook y renderiza una lista real (prueba del
   patrón). `features/_template/` documentado.
5. **Docs**: `CLAUDE.md` + `docs/ARCHITECTURE.md`.

## Verificación

- `pnpm dev` → navegar: `/` redirige a `/dashboard`; sin sesión redirige a `/login`;
  login mock entra al shell; el Sidebar (generado del registro) navega a cada módulo;
  los placeholders renderizan; `/clientes` muestra la lista sembrada con faker; breadcrumbs
  correctos; responsive (sidebar colapsa a Sheet en móvil); toggle de tema claro/oscuro.
- Probar un error en un service para ver el `ErrorBoundary` etiquetado por módulo.
- `pnpm build` compila sin errores de TypeScript.
- `pnpm lint` limpio.

## Fuera de alcance (entregas siguientes)

CRUD/forms/detalle completos de Clientes y demás módulos, integración IA real, backend/API
real, 2FA, calculadora del Arancel, generación documental Word, integración SAT.
