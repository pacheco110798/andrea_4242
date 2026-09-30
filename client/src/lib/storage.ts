import type { ZodType } from 'zod'

const KEY_PREFIX = 'caracol:'

export const storageKeys = {
  users: 'users',
  session: 'session',
  transactions: 'transactions',
} as const

type StorageKey = (typeof storageKeys)[keyof typeof storageKeys]

/** Reads and validates a stored value. Missing or corrupted data is treated as absent. */
export function readItem<T>(key: StorageKey, schema: ZodType<T>): T | null {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + key)
    if (raw === null) return null
    const parsed = schema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

export function writeItem(key: StorageKey, value: unknown): void {
  localStorage.setItem(KEY_PREFIX + key, JSON.stringify(value))
}

export function removeItem(key: StorageKey): void {
  localStorage.removeItem(KEY_PREFIX + key)
}
