import { describe, expect, it } from 'vitest'
import { lunarSouthPoleMission } from '@/lib/missions/lunar-south-pole/definition'
import { createInitialState } from '@/lib/simulation/engine/create-initial-state'
import { evaluateOutcome } from '@/lib/simulation/engine/evaluate-outcome'

describe('mission outcome', () => {
  it('fails when battery reserve is depleted', () => {
    const state = createInitialState()
    state.power = 0

    expect(evaluateOutcome(state, lunarSouthPoleMission)).toBe('failed')
  })
})
