import { Store } from '@tanstack/react-store'

export type Theme = 'light' | 'dark' | 'system'

export interface UiState {
  theme: Theme
}

const initialState: UiState = {
  theme: 'system',
}

export const uiStore = new Store<UiState>(initialState)

export function setTheme(theme: Theme) {
  uiStore.setState((state) => ({ ...state, theme }))
  applyTheme(theme)
}

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
  const theme = uiStore.state.theme
  applyTheme(theme)
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => applyTheme(uiStore.state.theme))
}
