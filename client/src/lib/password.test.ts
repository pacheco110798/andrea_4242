import { describe, expect, it } from 'vitest'

import { hashPassword, verifyPassword } from './password'

// Fewer iterations keep the suite fast; the algorithm is the same.
const ITERATIONS = 1_000

describe('password hashing', () => {
  it('never stores the plain password and verifies the right one', async () => {
    const stored = await hashPassword('Secret123', ITERATIONS)

    expect(JSON.stringify(stored)).not.toContain('Secret123')
    expect(await verifyPassword('Secret123', stored)).toBe(true)
    expect(await verifyPassword('secret123', stored)).toBe(false)
  })

  it('uses a random salt, so equal passwords produce different hashes', async () => {
    const first = await hashPassword('Secret123', ITERATIONS)
    const second = await hashPassword('Secret123', ITERATIONS)

    expect(first.salt).not.toBe(second.salt)
    expect(first.hash).not.toBe(second.hash)
  })
})
