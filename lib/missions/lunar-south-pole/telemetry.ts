import type { MissionState, ResourceKey } from './types'

export type ResourceTelemetryDefinition = {
  key: ResourceKey
  label: string
  /** Display unit. Phase 2 gives each resource a real capacity in this unit. */
  unit: string
  /** Simplified per-cycle draw used for the endurance estimate. */
  cycleDraw: number
}

export const resourceTelemetry: ResourceTelemetryDefinition[] = [
  { key: 'oxygen', label: 'Oxygen reserve', unit: '%', cycleDraw: 6 },
  { key: 'water', label: 'Potable water', unit: 'L', cycleDraw: 8 },
  { key: 'food', label: 'Food reserve', unit: 'days', cycleDraw: 7 },
  { key: 'power', label: 'Battery reserve', unit: '%', cycleDraw: 5 },
  { key: 'materials', label: 'Spare parts', unit: 'kits', cycleDraw: 1 },
]

/**
 * Rough endurance estimate inherited from the baseline model: remaining stock
 * divided by a fixed draw. It is deliberately labelled as an estimate and is
 * replaced by unit-aware reserves in Phase 2.
 */
export function estimateCyclesRemaining(state: MissionState, key: ResourceKey): number {
  const definition = resourceTelemetry.find(resource => resource.key === key)
  if (!definition) return 0
  const draw = key === 'power' ? Math.max(1, definition.cycleDraw - state.efficiency / 30) : definition.cycleDraw
  return Math.max(0, Math.floor(state[key] / draw))
}
