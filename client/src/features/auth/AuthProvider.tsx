import { type ReactNode, useCallback, useMemo, useState } from 'react'

import { AuthContext, type AuthContextValue } from './auth-context'
import type { LoginInput, RegisterInput } from './auth.schemas'
import * as authService from './auth.service'
import type { User } from './auth.types'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => authService.getSessionUser())

  const register = useCallback(async (input: RegisterInput) => {
    setUser(await authService.registerUser(input))
  }, [])

  const login = useCallback(async (input: LoginInput) => {
    setUser(await authService.loginUser(input))
  }, [])

  const logout = useCallback(() => {
    authService.logoutUser()
    setUser(null)
  }, [])

  const creditBalance = useCallback(
    (amountCents: number) => {
      if (!user) return
      setUser(authService.creditBalance(user.id, amountCents))
    },
    [user],
  )

  const value = useMemo<AuthContextValue>(
    () => ({ user, register, login, logout, creditBalance }),
    [user, register, login, logout, creditBalance],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
