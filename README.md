# NOTARIA IA

Plataforma web privada de gestión notarial integral para la Notaría Pública No. 1 de
Tetela de Ocampo, Puebla. Centraliza clientes, expedientes, honorarios, control
documental, cumplimiento (UIF/PLD), agenda, registro público y reportes, con asistencia
de IA jurídica. La especificación funcional completa está en [`docs/RFP.md`](docs/RFP.md).

> **Estado:** front en construcción con datos **simulados en memoria** (sin backend aún).
> Los módulos de Clientes, Expedientes y Honorarios están funcionales de extremo a extremo
> contra la capa mock.

## Stack

- **Framework:** TanStack Start (React 19, SSR, file-based routing)
- **Datos servidor:** TanStack Query · **Estado UI:** TanStack Store
- **Formularios:** TanStack Form + **Zod 4** (validación)
- **UI:** shadcn/ui (New York) · Tailwind CSS v4 · Lucide
- **Build/Tooling:** Vite 8 · TypeScript 6 · pnpm · Vitest · ESLint + Prettier

## Requisitos

- Node.js 20+ y **pnpm**.

## Cómo correr

```bash
pnpm install
pnpm dev            # servidor de desarrollo en http://localhost:3000
```

Acceso de desarrollo: la sesión es **mock** (cualquier correo/contraseña no vacíos inician
sesión). La sesión se guarda en `localStorage`.

## Scripts

```bash
pnpm dev               # desarrollo (puerto 3000)
pnpm build             # build de producción
pnpm preview           # previsualizar el build
pnpm test              # tests con Vitest
pnpm lint              # ESLint
pnpm format            # Prettier --write + eslint --fix
pnpm generate-routes   # regenerar src/routeTree.gen.ts (tras agregar/quitar rutas)
```

Verificación de tipos: `pnpm exec tsc --noEmit`.

## Variables de entorno

Por ahora no se requieren para correr el front con datos mock. Cuando se integre IA/backend:

```env
ANTHROPIC_API_KEY=...        # motor de IA (futuro)
VITE_LOG_LEVEL=info          # nivel de logs en el cliente (debug|info|warn|error)
```

## Estructura y convenciones

El proyecto sigue una **arquitectura por features**. Antes de tocar el código (o de pedirle
cambios a un asistente de IA), revisa:

- [`CLAUDE.md`](CLAUDE.md) — reglas accionables y convenciones que **todo cambio debe respetar**.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — estructura de carpetas, flujo de datos en
  capas y cómo agregar un módulo nuevo.

Resumen: cada módulo es una carpeta autocontenida en `src/features/<modulo>/`; las rutas en
`src/routes/` son solo cableado fino. El flujo de datos es
`componente → hook (TanStack Query) → service (*.service.ts) → mock-db / API real`.

## Módulos funcionales

| Módulo | Ruta | Qué hace |
| --- | --- | --- |
| Clientes | `/clientes` | CRUD de personas físicas/morales, cumplimiento UIF/PLD. |
| Expedientes | `/expedientes` | CRUD de trámites notariales (14 tipos de acto, estatus, documentos). |
| Honorarios | `/honorarios` | Cotizaciones con motor de cálculo del Arancel de Puebla. |

El resto de módulos del RFP existen como placeholders navegables.

## Licencia

Privado. Todos los derechos reservados.
