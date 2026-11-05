import { hasModule } from '@/lib/missions/lunar-south-pole/modules'
import type { MissionState } from '@/lib/missions/lunar-south-pole/types'

const BASE_GENERATION = 10
const SOLAR_GENERATION = 8
const BASE_DEMAND = 15
const RECYCLER_DEMAND = 3
const SHIELDING_DEMAND = 2
const BASE_BATTERY_CAPACITY = 100
const AUXILIARY_BATTERY_CAPACITY = 124

export type PowerBalance = {
  /** Generation for the cycle, in reserve points. */
  generation: number
  /** Demand for the cycle, in reserve points. */
  demand: number
  net: number
}

/**
 * Baseline power balance: fixed generation and demand constants with no load
 * shedding or interval conversion. Phase 2 replaces this with an energy balance
 * over the configured cycle interval with explicit load priorities.
 */
export function resolvePowerBalance(state: MissionState): PowerBalance {
  const generation = BASE_GENERATION + (hasModule(state, 'solar') ? SOLAR_GENERATION : 0)
  const demand =
    BASE_DEMAND +
    (hasModule(state, 'recycler') ? RECYCLER_DEMAND : 0) +
    (hasModule(state, 'shielding') ? SHIELDING_DEMAND : 0)

  return { generation, demand, net: generation - demand }
}

/** Configured storage ceiling for the current battery configuration. */
export function getBatteryCapacity(state: MissionState): number {
  return hasModule(state, 'battery') ? AUXILIARY_BATTERY_CAPACITY : BASE_BATTERY_CAPACITY
}
