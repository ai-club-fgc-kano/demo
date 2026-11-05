import { describe, expect, it } from 'vitest'
import { lunarSouthPoleMission } from '@/lib/missions/lunar-south-pole/definition'
import { advanceCycle } from '@/lib/simulation/engine/advance-cycle'
import { createInitialState } from '@/lib/simulation/engine/create-initial-state'
import { evaluateOutcome } from '@/lib/simulation/engine/evaluate-outcome'

describe('mission outcome', () => {
  it('fails when battery reserve is depleted', () => {
    const state = createInitialState()
    state.power = 0

    expect(evaluateOutcome(state, lunarSouthPoleMission)).toBe('failed')
  })

  it('records a warning when a reserve drops below its configured band', () => {
    const state = createInitialState()
    state.water = 29

    const next = advanceCycle(state, null, lunarSouthPoleMission)

    expect(next.log).toContainEqual(expect.objectContaining({
      title: 'Potable water below reserve',
      tone: 'warning',
    }))
  })
})
