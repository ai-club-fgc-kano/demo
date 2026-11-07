import { describe, expect, it } from 'vitest'
import { applyDelta } from '@/lib/simulation/domain/resources'
import { createInitialState } from '@/lib/simulation/engine/create-initial-state'

describe('resource accounting', () => {
  it('keeps the typed stock ledger synchronized with reserve points', () => {
    const state = createInitialState()

    applyDelta(state, { oxygen: -12 })

    expect(state.oxygen).toBe(76)
    expect(state.resources.oxygen).toMatchObject({ amount: 76, unit: 'crew-days' })
  })

  it('does not let a resource stock exceed its configured capacity', () => {
    const state = createInitialState()

    applyDelta(state, { power: 100 })

    expect(state.power).toBe(100)
    expect(state.resources.power.amount).toBe(state.resources.power.capacity)
  })
})
