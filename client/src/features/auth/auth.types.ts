import { z } from 'zod'

export const storedUserSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string(),
  password: z.object({
    algorithm: z.literal('PBKDF2-SHA256'),
    iterations: z.number().int().positive(),
    salt: z.string(),
    hash: z.string(),
  }),
  balanceCents: z.number().int().nonnegative(),
  createdAt: z.string(),
})

export const sessionSchema = z.object({
  userId: z.string(),
  expiresAt: z.string(),
})

export type StoredUser = z.infer<typeof storedUserSchema>
export type Session = z.infer<typeof sessionSchema>

/** User data safe to expose to the UI (no password hash). */
export type User = Omit<StoredUser, 'password'>
