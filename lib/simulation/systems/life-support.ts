import { hasModule } from '@/lib/missions/lunar-south-pole/modules'
import type { MissionState } from '@/lib/missions/lunar-south-pole/types'

const OXYGEN_BASE_DRAW = 6
const OXYGEN_SCRUBBED = 2
const OXYGEN_POWER_FLOOR = 10
const WATER_BASE_DRAW = 8
const RECYCLER_RECOVERY = 5
const FOOD_BASE_DRAW = 7

export type LifeSupportDelta = {
  oxygen: number
  water: number
  food: number
}

/**
 * Per-cycle life-support change. Air revitalization only recovers oxygen above
 * the configured power floor; water recovery requires an operational recovery
 * loop. Phase 2 models oxygen, CO2 removal, and food as separate inventories.
 */
export function resolveLifeSupportDelta(state: MissionState): LifeSupportDelta {
  const oxygen = -OXYGEN_BASE_DRAW + (state.power > OXYGEN_POWER_FLOOR ? OXYGEN_SCRUBBED : 0)
  const water = -WATER_BASE_DRAW + (hasModule(state, 'recycler') ? RECYCLER_RECOVERY : 0)
  const food = -FOOD_BASE_DRAW

  return { oxygen, water, food }
}
