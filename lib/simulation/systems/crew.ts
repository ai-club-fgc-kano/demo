import type { CrewCondition, MissionState } from '@/lib/missions/lunar-south-pole/types'

const POWER_FLOOR = 10
const LOW_WATER = 22
const LOW_POWER_PENALTY = -8
const LOW_WATER_PENALTY = -7
const NOMINAL_RECOVERY = 1

/**
 * Crew-safety change driven by the post-balance power and water state. Phase 2
 * tracks crew hours, fatigue, and EVA exposure separately from this aggregate.
 */
export function resolveCrewCondition(state: MissionState): CrewCondition {
  const fatigue = Math.min(100, Math.max(0, state.crew.fatigue + (state.power < POWER_FLOOR ? 8 : -2)))
  const radiationExposure = Math.min(100, state.crew.radiationExposure + 1)
  const availableHours = Math.max(0, 8 - Math.round(fatigue / 20))

  return { fatigue, radiationExposure, availableHours }
}

export function resolveCrewSafetyDelta(state: MissionState): number {
  const powerEffect = state.power < POWER_FLOOR ? LOW_POWER_PENALTY : NOMINAL_RECOVERY
  const waterEffect = state.water < LOW_WATER ? LOW_WATER_PENALTY : 0

  return powerEffect + waterEffect
}
