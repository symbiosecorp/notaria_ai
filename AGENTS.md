# AGENTS.md

Guía canónica para agentes de código IA (Claude Code, Cursor, Windsurf, Codex, …) en este
repositorio. **Única fuente de verdad**: `CLAUDE.md` y `.cursorrules` solo apuntan aquí;
cualquier cambio de reglas se hace en este archivo.

## Proyecto

**NOTARIA IA** — plataforma web privada de gestión notarial (Puebla, México). Dominio
jurídico/notarial, UI en **español**. Especificación funcional en `docs/RFP.md`. La
**arquitectura detallada y cómo agregar un módulo** están en `docs/ARCHITECTURE.md` —
léelo antes de cambios estructurales.

Estado: front con datos **simulados en memoria** (sin backend). Los módulos **Clientes,
Expedientes y Honorarios** están funcionales de extremo a extremo (lista/detalle/alta/
edición/borrado); el resto del RFP son placeholders navegables. Backend objetivo: Supabase
(migración por fases; se reescriben solo los `*.service.ts`).

## Comandos

Package manager **pnpm**. Dev en puerto 3000.

- `pnpm dev` — desarrollo · `pnpm build` — build · `pnpm preview`
- `pnpm test` — Vitest (un test: `pnpm vitest run <patrón>`)
- `pnpm lint` · `pnpm format` (prettier + eslint --fix)
- `pnpm generate-routes` — regenerar `src/routeTree.gen.ts` tras agregar/quitar rutas
- `pnpm exec tsc --noEmit` — verificación de tipos

**Verifica siempre** con `pnpm exec tsc --noEmit` y `pnpm lint` antes de dar por terminado.

## Guardarraíles automáticos

Estas reglas se verifican con herramientas; no dependen de tu memoria:

- **Pre-commit (husky):** `tsc --noEmit` + `eslint` corren en cada commit. **Nunca** uses
  `--no-verify`; si el hook falla, arregla la causa raíz.
- **CI (GitHub Actions):** typecheck, lint, tests y build corren en cada push/PR a `main`.
  Un PR rojo no se mergea.
- **Límites de imports (ESLint `no-restricted-imports`):**
  - Las features se importan **solo por su barrel** (`#/features/<modulo>`), nunca sus
    archivos internos.
  - Una feature **no** importa otra feature; la composición entre features ocurre en las
    rutas. (Excepción documentada: `src/lib/api/mock-db.ts`, que muere con Supabase.)
  - Nadie importa desde `src/routes/`.
  - `#/lib/api/mock-db` solo es accesible desde los services (`features/*/api/`).
- **Secretos:** valores reales solo en `.env.local` (gitignored vía `*.local`). Toda
  variable nueva se documenta en `.env.example` **sin** valor. La `service_role` key de
  Supabase jamás va en código cliente.
- **Supabase MCP en modo read-only:** úsalo para consultar esquema/datos. Los cambios de
  esquema van **siempre** en migraciones versionadas (`supabase/migrations/`, a partir de
  la Fase 1) revisables en PR — nunca directo contra la base.

## Reglas de arquitectura (no romper)

1. **Arquitectura por features.** Cada módulo vive en `src/features/<modulo>/` con esta
   anatomía: `schemas.ts`, `api/<modulo>.service.ts`, `hooks/use-<modulo>.ts`,
   `components/`, `index.ts` (barrel). Importa cada feature por su barrel.
2. **Las rutas son cableado fino.** En `src/routes/` no metas lógica de negocio; solo
   orquesta componentes y hooks de las features.
3. **Flujo de datos en una sola dirección:**
   `componente → hook (TanStack Query) → service (*.service.ts) → mock-db / API real`.
   Para migrar a backend real se reescribe **solo** el `*.service.ts`.
4. **Schema-first con Zod.** Cada entidad define su schema en `schemas.ts` y el tipo se
   infiere con `z.infer`. Los services validan en el límite con `schema.parse(...)`.
5. **Registro de módulos.** Para que un módulo aparezca en el sidebar/breadcrumbs,
   regístralo en `src/lib/config/modules.ts` (única fuente de verdad).
6. No edites `src/routeTree.gen.ts` (autogenerado).

## Convenciones de código no obvias

- **Imports con extensión explícita** `.ts`/`.tsx` (por `verbatimModuleSyntax` +
  `allowImportingTsExtensions`). Tipos en import separado: `import type { X } from '...'`.
- **Alias** `#/*` → `src/*` (úsalo siempre). `@/*` existe por compatibilidad; prefiere `#/`.
- **shadcn/ui** (New York, base zinc, lucide): agrega componentes con
  `pnpm dlx shadcn@latest add <c>`. Si el CLI pide sobrescribir un archivo existente,
  **no lo sobrescribas**. Los primitives viven en `src/components/ui/`.
- **Estilos**: reutiliza las variables/clases del design system "ocean/island" de
  `src/styles.css` (`bg-lagoon`, `text-sea-ink`, `.island-shell`, etc.). No reinventes.

## Patrones a seguir (úsalos, no inventes otros)

- **Formularios → TanStack Form** (`useForm`) con el **schema Zod de input como validador**
  (`validators: { onSubmit: <schema>InputSchema }`). Reglas:
  - Los `*InputSchema` **no llevan `.default()`**; los valores por defecto los aporta el
    `emptyValues` del formulario (así el tipo de entrada del validador coincide con el form data).
  - Campos de fecha/número convierten en el `onChange` del campo (input da string).
  - Los campos derivados/denormalizados (ej. `clienteNombre`) se calculan en `onSubmit` y
    luego `schema.parse(...)`. Errores de campo: `toFieldErrors(field.state.meta.errors)`
    de `#/lib/forms`. Ejemplo de referencia: `src/features/clientes/components/cliente-form.tsx`.
- **Confirmaciones → `ConfirmDialog`** (`#/components/common/confirm-dialog`). **Nunca**
  uses `window.confirm`, `window.alert` ni `window.prompt`.
- **Feedback de mutaciones → `toast`** de `sonner` (success/error).
- **Mutaciones → hooks** con `useMutation` que invalidan las query keys del feature
  (ver `use-clientes.ts`). IDs nuevos con `crypto.randomUUID()`.
- **Rutas de un módulo:** `index.tsx` (lista), `$id.tsx` (detalle), `nuevo.tsx`,
  `$id.editar.tsx`. Los loaders usan `context.queryClient.ensureQueryData(...)`. Monta
  `errorComponent: (props) => <AppErrorBoundary {...props} feature="<modulo>" />`.
- **Errores/logging:** lanza `AppError` (`#/lib/errors/app-error`) tipado por feature y usa
  `createLogger('<feature>')` (`#/lib/errors/logger`).
- **Formato:** `formatDate` / `formatCurrency` de `#/lib/format`.

## Cómo agregar un módulo

Resumen (detalle en `docs/ARCHITECTURE.md`): clona `src/features/_template/`, define el
schema, implementa el service contra `mockDb`, crea los hooks (`queryOptions` + mutaciones),
los componentes, regístralo en `src/lib/config/modules.ts`, crea las rutas en
`src/routes/_app/<modulo>/` y corre `pnpm generate-routes`.

## Stack (referencia)

TanStack Start (React 19, SSR, file-based routing) · TanStack Query/Store/Form · Zod 4 ·
shadcn/ui + Tailwind v4 · Vite 8 · TypeScript 6 (strict) · pnpm.
Adaptadores de IA disponibles (`@tanstack/ai-*`: Anthropic/OpenAI/Gemini/Ollama); aún sin
integrar — al usarlos, ponlos detrás de la capa de services como el resto.
