import { useStore } from '@tanstack/react-store'
import { authStore, login, logout  } from '#/stores/auth-store'
import type {User} from '#/stores/auth-store';

export type { User }

export interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: typeof login
  logout: typeof logout
}

export function useAuth(): AuthContextValue {
  const state = useStore(authStore)
  return {
    ...state,
    login,
    logout,
  }
}
