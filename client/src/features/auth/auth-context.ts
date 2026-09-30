import { createContext } from 'react'

import type { LoginInput, RegisterInput } from './auth.schemas'
import type { User } from './auth.types'

export interface AuthContextValue {
  user: User | null
  register: (input: RegisterInput) => Promise<void>
  login: (input: LoginInput) => Promise<void>
  logout: () => void
  creditBalance: (amountCents: number) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
