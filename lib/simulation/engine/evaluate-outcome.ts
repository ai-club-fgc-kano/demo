import type { MissionStatus } from '@/lib/simulation/domain/types'
import type { MissionDefinition, MissionState } from '@/lib/missions/lunar-south-pole/types'

/**
 * Terminal conditions for the baseline model: any essential stock or condition
 * index at zero aborts the mission, and reaching the configured duration in the
 * configured condition completes it. Phase 3 expands this into a rubric-based
 * outcome with named outcome bands.
 */
export function evaluateOutcome(state: MissionState, mission: MissionDefinition): MissionStatus {
  const essentialReserveDepleted =
    state.oxygen <= 0 ||
    state.water <= 0 ||
    state.food <= 0 ||
    state.power <= 0 ||
    state.safety <= 0 ||
    state.integrity <= 0

  if (essentialReserveDepleted) return 'failed'
  if (state.cycle >= mission.durationCycles) return 'success'
  return 'active'
}
