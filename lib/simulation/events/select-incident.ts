import type { MissionDefinition, MissionEvent, MissionState } from '@/lib/missions/lunar-south-pole/types'

const INCIDENT_CHANCE = 0.62
const INCIDENT_INTERVAL = 3

/**
 * Interim incident selection carried over from the baseline engine: a fixed
 * chance plus a periodic safety net, with a uniformly random incident from the
 * mission set. It does not yet look at state, exposure, or cooldowns.
 *
 * Phase 3 replaces this module with seeded selection and state-dependent
 * eligibility. The injectable `random` source exists so the current behaviour
 * can be tested deterministically in the meantime.
 */
export function selectIncident(
  state: MissionState,
  mission: MissionDefinition,
  random: () => number = Math.random,
): MissionEvent | null {
  const triggered = random() < INCIDENT_CHANCE || state.cycle % INCIDENT_INTERVAL === 0
  if (!triggered || mission.events.length === 0) return null

  const index = Math.floor(random() * mission.events.length)
  return structuredClone(mission.events[index])
}
