import { describe, expect, it } from 'vitest'
import { createInitialState } from '@/lib/simulation/engine/create-initial-state'
import { resolveCrewCondition } from '@/lib/simulation/systems/crew'

describe('crew condition', () => {
  it('reduces available hours as fatigue rises', () => {
    const state = createInitialState()
    state.crew.fatigue = 80

    expect(resolveCrewCondition(state)).toMatchObject({
      fatigue: 78,
      availableHours: 4,
      radiationExposure: 1,
    })
  })
})
