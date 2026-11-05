import { LUNAR_SOUTH_POLE_MISSION_ID, lunarSouthPoleMission } from './lunar-south-pole/definition'
import type { MissionDefinition } from './lunar-south-pole/types'

const missionRegistry: Record<string, MissionDefinition> = {
  [LUNAR_SOUTH_POLE_MISSION_ID]: lunarSouthPoleMission,
}

export const DEFAULT_MISSION_ID = LUNAR_SOUTH_POLE_MISSION_ID

export function getMission(id: string = DEFAULT_MISSION_ID): MissionDefinition {
  const mission = missionRegistry[id]
  if (!mission) throw new Error(`Unknown mission: ${id}`)
  return mission
}
