import type { MissionState, ResourceDelta, ResourceKey } from '@/lib/missions/lunar-south-pole/types'

const RESOURCE_KEYS: ResourceKey[] = ['oxygen', 'water', 'food', 'power', 'materials']

/**
 * Clamp and round a reserve index. The baseline model stores every stock as a
 * 0–100 index; Phase 2 replaces this with per-resource capacities and units.
 */
export function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)))
}

/** True when the mission state holds at least the requested amount of each resource. */
export function canAfford(state: MissionState, cost: Partial<Record<ResourceKey, number>>): boolean {
  return Object.entries(cost).every(([key, amount]) => state[key as ResourceKey] >= (amount ?? 0))
}

/**
 * Apply a signed delta to a cloned mission state. Only known resource fields and
 * the two tracked condition indices are touched; unknown keys are ignored so a
 * malformed effect cannot invent a state field.
 */
export function syncResourceLedger(state: MissionState): void {
  for (const key of RESOURCE_KEYS) {
    const stock = state.resources?.[key]
    if (!stock) continue
    stock.amount = Math.max(0, Math.min(stock.capacity, state[key]))
  }
}

export function applyDelta(state: MissionState, delta: ResourceDelta): void {
  for (const [key, amount] of Object.entries(delta)) {
    if (key === 'research' || key === 'readiness') {
      state[key] = clamp(state[key] + (amount ?? 0))
      continue
    }
    if (key in state) {
      const resourceKey = key as ResourceKey
      const nextAmount = clamp(state[resourceKey] + (amount ?? 0))
      state[resourceKey] = nextAmount
      const stock = state.resources?.[resourceKey]
      if (stock) {
        stock.amount = Math.max(0, Math.min(stock.capacity, nextAmount))
      }
    }
  }
}
