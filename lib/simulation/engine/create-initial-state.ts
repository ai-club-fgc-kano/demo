import { getMission } from '@/lib/missions/registry'
import type { MissionDefinition, MissionState } from '@/lib/missions/lunar-south-pole/types'

export function createInitialState(mission: MissionDefinition = getMission()): MissionState {
  const { startingResources, startingCondition, introLog } = mission
  const seed = 1

  return {
    run: { seed, scenarioVersion: 'lunar-south-pole-v1', cycleLengthHours: 24 },
    environment: mission.environment[0],
    outcome: null,
    cycle: 1,
    ...startingResources,
    safety: startingCondition.safety,
    integrity: startingCondition.integrity,
    readiness: startingCondition.readiness,
    efficiency: startingCondition.efficiency,
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
