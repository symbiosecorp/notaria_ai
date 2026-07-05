import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { loginFn, logoutFn } from './api.ts'
import { sessionKeys, sessionQueryOptions } from './session.ts'
import type { LoginResult } from './api.ts'
import type { LoginInput } from './schemas.ts'
import type { User } from './types.ts'

export type { User }

export interface AuthContextValue {
  user: User | null
  login: (input: LoginInput) => Promise<LoginResult>
  logout: () => Promise<void>
}

export function useAuth(): AuthContextValue {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: user } = useQuery(sessionQueryOptions())

  async function login(input: LoginInput): Promise<LoginResult> {
    const result = await loginFn({ data: input })
    if (result.ok) {
      await queryClient.invalidateQueries({ queryKey: sessionKeys.session })
      await router.invalidate()
    }
    return result
  }

  async function logout() {
    await logoutFn()
    queryClient.setQueryData(sessionKeys.session, null)
    await router.invalidate()
    await router.navigate({ to: '/login' })
  }

  return {
    user: user ?? null,
    login,
    logout,
  }
}
