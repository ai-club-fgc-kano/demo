import { describe, expect, it } from 'vitest'
import { createInitialState } from '@/lib/simulation/engine/create-initial-state'
import { resolvePowerBalance } from '@/lib/simulation/systems/power'

describe('power balance', () => {
  it('reports served energy and unmet demand separately', () => {
    const balance = resolvePowerBalance(createInitialState())

    expect(balance.generation).toBeGreaterThan(0)
    expect(balance.demand).toBeGreaterThan(0)
    expect(balance.stored).toBe(0)
    expect(balance.unmet).toBeGreaterThan(0)
    expect(balance.net).toBe(balance.generation - balance.demand)
  })
})
