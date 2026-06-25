# NOTARIA IA — Guía de convenciones para agentes

> Este documento es la referencia rápida de convenciones para trabajar en el frontend de NOTARIA IA. Para la arquitectura detallada ver `docs/ARCHITECTURE.md`.

## Stack

- **Framework:** TanStack Start (React, file-based routing, SSR opcional).
- **Estado servidor:** TanStack Query.
- **Estado UI global:** TanStack Store.
- **UI:** shadcn/ui (New York), Tailwind CSS v4, Lucide icons.
- **Validación:** Zod 4.
- **Mock datos:** `@faker-js/faker` + `src/lib/api/mock-db.ts`.

## Arquitectura por features

Cada módulo del RFP es una carpeta autocontenida en `src/features/<modulo>/`. Las rutas en `src/routes/` son **solo cableado fino**; no deben contener lógica de negocio.

Flujo de datos estricto:

```
UI (componente) → hook (TanStack Query) → service (*.service.ts) → mock-db / API real
```

Cambiar de mock a backend real implica reescribir **solo** el archivo `*.service.ts` de la feature.

## Cómo agregar un módulo nuevo

1. Copiar `src/features/_template/` a `src/features/<nombre>/`.
2. Reemplazar `template` por `<nombre>` en archivos, nombres de funciones y tipos.
3. Definir el schema en `schemas.ts` con Zod.
4. Implementar el contrato en `api/<nombre>.service.ts` (hoy leyendo de `mockDb`, mañana con `fetch`).
5. Crear `queryOptions` en `hooks/use-<nombre>.ts`.
6. Crear componentes UI en `components/`.
7. Registrar el módulo en `src/lib/config/modules.ts`.
8. Crear la ruta en `src/routes/_app/<ruta>.tsx` (o `src/routes/_app/<ruta>/index.tsx`).
9. Ejecutar `pnpm generate-routes` para regenerar `src/routeTree.gen.ts`.
10. Verificar `pnpm exec tsc --noEmit` y `pnpm lint`.

## Registro de módulos (única fuente de verdad)

`src/lib/config/modules.ts` contiene el array tipado `modules`. El sidebar, breadcrumbs y verificación de permisos se generan a partir de aquí. Agregar un módulo = 1 entrada + 1 archivo de ruta.

## Manejo de errores

- Usar `AppError` (`src/lib/errors/app-error.ts`) para errores tipados por feature.
- Usar `createLogger('feature')` (`src/lib/errors/logger.ts`) para logs con tag.
- Montar `errorComponent` en rutas para capturar errores con `AppErrorBoundary`.

## Autenticación y permisos

- El estado de sesión vive en `src/stores/auth-store.ts`.
- `useAuth()` en `src/lib/auth/auth-context.tsx` expone `user`, `isLoading`, `login`, `logout`.
- `requireAuth()` en `src/lib/auth/guard.ts` se usa en `beforeLoad` de rutas protegidas.
- Los permisos y roles base están en `src/lib/auth/permissions.ts`.

## Comandos útiles

```bash
pnpm dev                 # servidor de desarrollo en http://localhost:3000
pnpm generate-routes     # regenerar árbol de rutas de TanStack Router
pnpm exec tsc --noEmit   # verificación de tipos
pnpm lint                # ESLint
pnpm lint --fix          # ESLint con auto-fix
pnpm build               # build de producción
```

## Alias

- `#/*` → `src/*` (usar siempre para imports internos).
- `@/*` → `src/*` (se mantiene por compatibilidad, preferir `#/*`).

## Notas

- No introducir lógica de negocio en `src/routes/`; las rutas solo orquestan componentes y hooks.
- No modificar `src/routeTree.gen.ts` manualmente.
- Mantener el estilo del design system "ocean/island" definido en `src/styles.css`.
