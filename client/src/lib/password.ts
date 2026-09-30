// Passwords are never stored in plain text: we keep a salted PBKDF2-SHA256 hash.
// Iterations follow the OWASP recommendation for PBKDF2-HMAC-SHA256.
export const PBKDF2_ITERATIONS = 600_000
const SALT_BYTES = 16
const HASH_BITS = 256

export interface PasswordHash {
  algorithm: 'PBKDF2-SHA256'
  iterations: number
  salt: string
  hash: string
}

const encoder = new TextEncoder()

const toBase64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes))
const fromBase64 = (value: string) => Uint8Array.from(atob(value), (char) => char.charCodeAt(0))

async function deriveBits(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    key,
    HASH_BITS,
  )
  return new Uint8Array(bits)
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}

export async function hashPassword(
  password: string,
  iterations = PBKDF2_ITERATIONS,
): Promise<PasswordHash> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES))
  const hash = await deriveBits(password, salt, iterations)
  return { algorithm: 'PBKDF2-SHA256', iterations, salt: toBase64(salt), hash: toBase64(hash) }
}

export async function verifyPassword(password: string, stored: PasswordHash): Promise<boolean> {
  const hash = await deriveBits(password, fromBase64(stored.salt), stored.iterations)
  return constantTimeEqual(hash, fromBase64(stored.hash))
}
