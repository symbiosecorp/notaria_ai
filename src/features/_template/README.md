# Plantilla de Feature

Copia esta carpeta como `src/features/<nombre-modulo>/` para crear un nuevo módulo.

## Convención de capas

1. `schemas.ts` — Zod schemas y tipos inferidos (`z.infer`).
2. `api/<modulo>.service.ts` — Contrato de negocio + implementación mock (hoy) o `fetch` (mañana).
3. `hooks/use-<modulo>.ts` — Wrappers de TanStack Query (`queryOptions`).
4. `components/` — Componentes UI propios del dominio.
5. `index.ts` — Barrel que exporta la superficie pública del feature.

## Flujo de datos

```
Componente → hook (TanStack Query) → service → mock-db / API real
```

Cambiar de mock a backend real implica reescribir **solo** `*.service.ts`.

## Pasos para agregar un módulo

1. Copiar esta carpeta a `src/features/<nombre>/`.
2. Reemplazar `template` por el nombre del módulo en archivos y nombres de funciones.
3. Definir el schema en `schemas.ts`.
4. Implementar `service.ts` leyendo/escribiendo de `mockDb` o `fetch`.
5. Crear `queryOptions` en `hooks/use-<modulo>.ts`.
6. Crear componentes UI en `components/`.
7. Registrar el módulo en `src/lib/config/modules.ts`.
8. Crear la ruta en `src/routes/_app/<ruta>.tsx` (o `src/routes/_app/<ruta>/index.tsx`).
9. Ejecutar `pnpm generate-routes` para regenerar el árbol de rutas.
