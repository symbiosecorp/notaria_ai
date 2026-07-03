import { Store } from '@tanstack/react-store'
import { ROLES  } from '#/lib/auth/permissions'
import type {Role} from '#/lib/auth/permissions';

export interface User {
  id: string
  email: string
  name: string
  role: Role
}

export interface AuthState {
  user: User | null
  isLoading: boolean
}

const STORAGE_KEY = 'notaria.auth.user'

const MOCK_USER: User = {
  id: 'usr-1',
  email: 'notario@notaria1tetela.gob.mx',
  name: 'Notario Ejemplo',
  role: ROLES.NOTARIO,
}

function loadPersistedUser(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export const authStore = new Store<AuthState>({
  user: loadPersistedUser(),
  isLoading: false,
})

// Persiste la sesión mock para sobrevivir refrescos (solo en cliente).
// Con auth real esto se reemplaza por cookies/tokens legibles en el servidor.
if (typeof window !== 'undefined') {
  authStore.subscribe(() => {
    const { user } = authStore.state
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  })
}

export async function login(email: string, password: string) {
  authStore.setState((state) => ({ ...state, isLoading: true }))
  try {
    await new Promise((resolve) => setTimeout(resolve, 600))
    if (!email || !password) {
      throw new Error('Credenciales inválidas')
    }
    authStore.setState((state) => ({
      ...state,
      user: { ...MOCK_USER, email },
      isLoading: false,
    }))
  } catch (error) {
    authStore.setState((state) => ({ ...state, isLoading: false }))
    throw error
  }
}

export function logout() {
  authStore.setState((state) => ({ ...state, user: null }))
}

export const auth = {
  get user() {
    return authStore.state.user
  },
  get isLoading() {
    return authStore.state.isLoading
  },
  login,
  logout,
}
