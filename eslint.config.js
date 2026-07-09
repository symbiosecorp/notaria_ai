//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

// Límites de arquitectura (ver AGENTS.md → Guardarraíles automáticos).
// no-restricted-imports no se fusiona entre bloques: cada zona redeclara la
// lista completa de patrones que le aplican. Se usa `regex` (no `group`)
// porque la sintaxis gitignore de `group` trata `#...` como comentario.
const featureInternals = {
  regex: '^[#@]/features/[^/]+/.+',
  message: 'Importa las features solo por su barrel: #/features/<modulo>',
}
const crossFeature = {
  regex: '^[#@]/features(/.*)?$',
  message: 'Una feature no importa otra feature; la composición ocurre en las rutas.',
}
const routesImport = {
  regex: '^[#@]/routes(/.*)?$',
  message: 'Nada se importa desde src/routes; las rutas solo consumen.',
}
const mockDbImport = {
  regex: '^[#@]/lib/api/mock-db.*',
  message: 'Solo los services (features/*/api) acceden a mock-db.',
}
const supabaseAdminImport = {
  regex: '^[#@]/integrations/supabase/admin.*',
  message:
    'El cliente admin (service_role) solo se usa en *-api.ts o repositorios Supabase del servidor.',
}

export default [
  ...tanstackConfig,
  {
    rules: {
      'import/no-cycle': 'off',
      'import/order': 'off',
      'sort-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      'pnpm/json-enforce-catalog': 'off',
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [featureInternals, routesImport, mockDbImport, supabaseAdminImport] },
      ],
    },
  },
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [crossFeature, routesImport, mockDbImport, supabaseAdminImport] },
      ],
    },
  },
  {
    // Los services son la única capa con acceso a mock-db
    files: ['src/features/*/api/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [crossFeature, routesImport, supabaseAdminImport] },
      ],
    },
  },
  {
    // Server functions y repos Supabase pueden usar el cliente admin
    files: [
      'src/features/*/api/**/*-api.ts',
      'src/features/*/api/**/*.repository.supabase.ts',
      'src/lib/auth/api.ts',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [crossFeature, routesImport] },
      ],
    },
  },
  {
    // Excepción documentada: mock-db necesita los schemas de las features.
    // Desaparece con la migración a Supabase (Fase 1).
    files: ['src/lib/api/mock-db.ts'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [routesImport] }],
    },
  },
  {
    ignores: [
      'eslint.config.js',
      'prettier.config.js',
      'src/routeTree.gen.ts',
      // Autogenerado con `supabase gen types typescript --linked`
      'src/integrations/supabase/database.types.ts',
    ],
  },
]
