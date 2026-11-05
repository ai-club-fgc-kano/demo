import type { MissionState } from '@/lib/missions/lunar-south-pole/types'

const POWER_FLOOR = 10
const LOW_WATER = 22
const LOW_POWER_PENALTY = -8
const LOW_WATER_PENALTY = -7
const NOMINAL_RECOVERY = 1

/**
 * Crew-safety change driven by the post-balance power and water state. Phase 2
 * tracks crew hours, fatigue, and EVA exposure separately from this aggregate.
 */
export function resolveCrewSafetyDelta(state: MissionState): number {
  const powerEffect = state.power < POWER_FLOOR ? LOW_POWER_PENALTY : NOMINAL_RECOVERY
  const waterEffect = state.water < LOW_WATER ? LOW_WATER_PENALTY : 0

  return powerEffect + waterEffect
}
