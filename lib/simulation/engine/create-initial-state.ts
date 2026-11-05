import { getMission } from '@/lib/missions/registry'
import type { MissionDefinition, MissionState } from '@/lib/missions/lunar-south-pole/types'

export function createInitialState(mission: MissionDefinition = getMission()): MissionState {
  const { startingResources, startingCondition, introLog } = mission
  const seed = 1
  const resources = Object.fromEntries(
    Object.entries(mission.resources).map(([key, definition]) => [key, {
      amount: startingResources[key as keyof typeof startingResources],
      capacity: definition.capacity,
      unit: definition.unit,
    }]),
  ) as MissionState['resources']

  return {
    run: { seed, scenarioVersion: 'lunar-south-pole-v1', cycleLengthHours: 24 },
    environment: mission.environment[0],
    outcome: null,
    resources,
    cycle: 1,
    ...startingResources,
    safety: startingCondition.safety,
    integrity: startingCondition.integrity,
    readiness: startingCondition.readiness,
    efficiency: startingCondition.efficiency,
    crew: { fatigue: 12, radiationExposure: 0, availableHours: 8 },
    research: 0,
    status: 'active',
    modules: [],
    queued: [],
    pendingEvent: null,
    log: [{ cycle: 1, kind: 'system', title: introLog.title, detail: introLog.detail }],
    objectives: mission.objectives.map(objective => ({ ...objective, done: false })),
    history: [{ cycle: 1, ...startingCondition }],
  }
}
