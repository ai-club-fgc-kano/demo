import { describe, expect, it } from 'vitest'
import { createSeededRandom } from '@/lib/simulation/domain/random'

describe('seeded random source', () => {
  it('replays the same sequence for the same seed', () => {
    const first = createSeededRandom(20261105)
    const second = createSeededRandom(20261105)

    expect([first(), first(), first()]).toEqual([second(), second(), second()])
  })

  it('keeps values inside the normalized random range', () => {
    const random = createSeededRandom(7)
    const values = Array.from({ length: 100 }, () => random())

    expect(values.every((value) => value >= 0 && value < 1)).toBe(true)
  })
})
