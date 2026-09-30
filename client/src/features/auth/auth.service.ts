import { z } from 'zod'

import { hashPassword, verifyPassword } from '../../lib/password'
import { readItem, removeItem, storageKeys, writeItem } from '../../lib/storage'
import type { LoginInput, RegisterInput } from './auth.schemas'
import { type Session, type StoredUser, type User, sessionSchema, storedUserSchema } from './auth.types'

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000

export type AuthErrorCode = 'EMAIL_TAKEN' | 'INVALID_CREDENTIALS' | 'USER_NOT_FOUND'

export class AuthError extends Error {
  readonly code: AuthErrorCode

  constructor(code: AuthErrorCode) {
    super(code)
    this.name = 'AuthError'
    this.code = code
  }
}

const readUsers = () => readItem(storageKeys.users, z.array(storedUserSchema)) ?? []
const writeUsers = (users: StoredUser[]) => writeItem(storageKeys.users, users)

function toUser({ password: _password, ...user }: StoredUser): User {
  return user
}

function startSession(userId: string, now: Date): void {
  const session: Session = {
    userId,
    expiresAt: new Date(now.getTime() + SESSION_DURATION_MS).toISOString(),
  }
  writeItem(storageKeys.session, session)
}

export async function registerUser(input: RegisterInput, now = new Date()): Promise<User> {
  const users = readUsers()
  if (users.some((user) => user.email === input.email)) throw new AuthError('EMAIL_TAKEN')

  const user: StoredUser = {
    id: crypto.randomUUID(),
    fullName: input.fullName,
    email: input.email,
    password: await hashPassword(input.password),
    balanceCents: 0,
    createdAt: now.toISOString(),
  }

  writeUsers([...users, user])
  startSession(user.id, now)
  return toUser(user)
}

export async function loginUser(input: LoginInput, now = new Date()): Promise<User> {
  const user = readUsers().find((candidate) => candidate.email === input.email)
  // Same error for unknown email and wrong password, so accounts can't be enumerated.
  if (!user || !(await verifyPassword(input.password, user.password))) {
    throw new AuthError('INVALID_CREDENTIALS')
  }

  startSession(user.id, now)
  return toUser(user)
}

export function logoutUser(): void {
  removeItem(storageKeys.session)
}

/** Restores the logged-in user from an active, non-expired session. */
export function getSessionUser(now = new Date()): User | null {
  const session = readItem(storageKeys.session, sessionSchema)
  if (!session) return null

  const user = readUsers().find((candidate) => candidate.id === session.userId)
  if (!user || new Date(session.expiresAt) <= now) {
    removeItem(storageKeys.session)
    return null
  }

  return toUser(user)
}

export function creditBalance(userId: string, amountCents: number): User {
  const users = readUsers()
  const user = users.find((candidate) => candidate.id === userId)
  if (!user) throw new AuthError('USER_NOT_FOUND')

  const updated: StoredUser = { ...user, balanceCents: user.balanceCents + amountCents }
  writeUsers(users.map((candidate) => (candidate.id === userId ? updated : candidate)))
  return toUser(updated)
}
