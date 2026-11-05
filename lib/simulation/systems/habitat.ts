import { hasModule } from '@/lib/missions/lunar-south-pole/modules'
import type { MissionState } from '@/lib/missions/lunar-south-pole/types'

const UNPROTECTED_INTEGRITY_DRIFT = -1

/** Structure/seal wear per cycle; the storm shelter removes the ambient drift. */
export function resolveHabitatIntegrityDelta(state: MissionState): number {
  return hasModule(state, 'shielding') ? 0 : UNPROTECTED_INTEGRITY_DRIFT
}
