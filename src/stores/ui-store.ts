import { create } from 'zustand'

export type Theme = 'light' | 'dark' | 'system'

interface UiState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const useUiStore = create<UiState>()((set) => ({
  theme: 'system',
  setTheme: (theme) => {
    set({ theme })
    applyTheme(theme)
  },
}))

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark)
  if (isDark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function initializeTheme() {
  applyTheme(useUiStore.getState().theme)
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => applyTheme(useUiStore.getState().theme))
}
