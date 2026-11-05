import { lunarEvents } from './events'
import type { MissionDefinition } from './types'

export const LUNAR_SOUTH_POLE_MISSION_ID = 'lunar-south-pole'

/**
 * Fictional two-person training scenario at a pre-deployed lunar south-pole
 * outpost. Parameters are scenario assumptions, not NASA flight data.
 */
export const lunarSouthPoleMission: MissionDefinition = {
  id: LUNAR_SOUTH_POLE_MISSION_ID,
  name: 'OUTPOST',
  site: 'Lunar south pole / surface outpost',
  crewSize: 2,
  durationCycles: 8,
  startingResources: {
    oxygen: 88,
    water: 64,
    food: 68,
    power: 42,
    materials: 62,
  },
  startingCondition: {
    safety: 91,
    integrity: 86,
    readiness: 94,
    efficiency: 78,
  },
  objectives: [
    { id: 'systems-check', label: 'Complete habitat systems check' },
    { id: 'sample-return', label: 'Collect a polar regolith sample' },
    { id: 'crew-safety', label: 'Maintain crew safety above 60%' },
  ],
  events: lunarEvents,
  introLog: {
    title: 'Surface operations initialized',
    detail: 'Two astronauts are awake. Essential systems are online at the lunar south pole.',
  },
}
