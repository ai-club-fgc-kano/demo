import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  advanceCycle,
  chooseEvent,
  createInitialState,
  getAvailableActions,
  validateAction,
} from '@/lib/simulation/engine'
import { lunarSouthPoleMission } from '@/lib/missions/lunar-south-pole/definition'
import type { MissionState } from '@/lib/missions/lunar-south-pole/types'

/** Selects no incident: 0.99 is above the baseline chance and 2 is not a multiple of 3. */
function withoutIncidents() {
  return vi.spyOn(Math, 'random').mockReturnValue(0.99)
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('initial state', () => {
  it('starts active with the configured resources, assets and objectives', () => {
    const state = createInitialState()

    expect(state.status).toBe('active')
    expect(state.cycle).toBe(1)
    expect(state.modules).toEqual([])
    expect(state.queued).toEqual([])
    expect(state.pendingEvent).toBeNull()

    for (const [key, value] of Object.entries(lunarSouthPoleMission.startingResources)) {
      expect(state[key as keyof MissionState]).toBe(value)
    }

    expect(state.objectives.map(objective => objective.id)).toEqual([
      'systems-check',
      'sample-return',
      'crew-safety',
    ])
    expect(state.objectives.every(objective => !objective.done)).toBe(true)
    expect(state.history).toEqual([{ cycle: 1, ...lunarSouthPoleMission.startingCondition }])
  })
})

describe('action validation', () => {
  it('hides and rejects a module the crew cannot pay for', () => {
    const state = createInitialState()
    state.materials = 5

    expect(getAvailableActions(state)).not.toContain('solar')
    expect(validateAction(state, 'solar')).toMatch(/not available/i)
  })

  it('rejects an invalid operation without mutating reserves, objectives or the clock', () => {
    const state = createInitialState()
    state.materials = 5
    const next = advanceCycle(state, 'solar')

    expect(next.cycle).toBe(state.cycle)
    expect(next.materials).toBe(state.materials)
    expect(next.objectives).toEqual(state.objectives)
    expect(next.log.at(-1)).toMatchObject({ title: 'Operation unavailable', tone: 'warning' })
    expect(state.log).toHaveLength(1)
  })

  it('does not advance while an incident is unresolved', () => {
    const state = createInitialState()
    state.pendingEvent = structuredClone(lunarSouthPoleMission.events[0])

    expect(advanceCycle(state, 'inspect').cycle).toBe(state.cycle)
  })
})

describe('cycle resolution', () => {
  it('applies documented passive balances for a quiet cycle', () => {
    withoutIncidents()
    const next = advanceCycle(createInitialState(), null)

    expect(next.cycle).toBe(2)
    expect(next.power).toBe(37) // 42 + (10 generation − 15 demand)
    expect(next.oxygen).toBe(84) // 88 − 6 draw + 2 scrubbed (power above 10)
    expect(next.water).toBe(56) // 64 − 8 draw, no recovery loop yet
    expect(next.food).toBe(61) // 68 − 7
    expect(next.integrity).toBe(85) // 86 − 1 unprotected drift
    expect(next.safety).toBe(92) // 91 + 1 nominal recovery
    expect(next.research).toBe(2) // passive research, no operation
    expect(next.pendingEvent).toBeNull()
    expect(next.history.at(-1)).toEqual({
      cycle: 2,
      safety: 92,
      integrity: 85,
      readiness: 94,
      efficiency: 78,
    })
  })

  it('is reproducible for the same state and action', () => {
    withoutIncidents()
    const state = createInitialState()

    expect(advanceCycle(state, 'inspect')).toEqual(advanceCycle(state, 'inspect'))
  })

  it('commissions a queued module on its configured delay', () => {
    withoutIncidents()
    const next = advanceCycle(createInitialState(), 'solar')

    expect(next.queued).toEqual([])
    expect(next.modules).toContain('solar')
    expect(next.materials).toBe(42) // 62 − 20 kits
  })

  it('completes state-derived objectives from actual results, not from a click', () => {
    withoutIncidents()
    const inspected = advanceCycle(createInitialState(), 'inspect')
    const systemsCheck = inspected.objectives.find(objective => objective.id === 'systems-check')

    expect(systemsCheck?.done).toBe(true)
    expect(inspected.objectives.find(objective => objective.id === 'sample-return')?.done).toBe(false)
  })

  it('ends the mission when an essential reserve is depleted', () => {
    withoutIncidents()
    const state = createInitialState()
    state.water = 1

    const next = advanceCycle(state, null)

    expect(next.status).toBe('failed')
    expect(next.log.at(-1)).toMatchObject({ title: 'Mission aborted', tone: 'critical' })
  })

  it('completes the configured mission window', () => {
    withoutIncidents()
    const state = createInitialState()
    state.cycle = lunarSouthPoleMission.durationCycles - 1

    const next = advanceCycle(state, null)

    expect(next.cycle).toBe(lunarSouthPoleMission.durationCycles)
    expect(next.status).toBe('success')
  })
})

describe('event resolution', () => {
  it('applies the chosen effects, clears the incident and records the decision', () => {
    const state = createInitialState()
    state.pendingEvent = structuredClone(lunarSouthPoleMission.events.find(event => event.id === 'dust')!)

    const next = chooseEvent(state, 'clean')

    expect(next.pendingEvent).toBeNull()
    expect(next.materials).toBe(54) // 62 − 8 kits
    expect(next.power).toBe(39) // 42 − 3
    expect(next.safety).toBe(96) // 91 + 5
    expect(next.log.at(-1)).toMatchObject({ kind: 'event', tone: 'good' })
  })

  it('leaves the state unchanged for an unknown choice', () => {
    const state = createInitialState()
    state.pendingEvent = structuredClone(lunarSouthPoleMission.events[0])

    const next = chooseEvent(state, 'does-not-exist')

    expect(next.materials).toBe(state.materials)
    expect(next.pendingEvent).not.toBeNull()
    expect(next.log).toHaveLength(state.log.length)
  })
})
