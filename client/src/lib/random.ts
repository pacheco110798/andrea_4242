/** Deterministic PRNG (mulberry32) so simulated data stays stable across reloads. */
export function createSeededRandom(seed: string): () => number {
  let state = 0
  for (let i = 0; i < seed.length; i++) state = Math.imul(31, state) + seed.charCodeAt(i)

  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const randomInt = (random: () => number, min: number, max: number) =>
  min + Math.floor(random() * (max - min + 1))
