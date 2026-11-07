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
  brief: {
    purpose: 'Train a two-person crew to operate a resilient lunar south-pole outpost through a constrained surface window.',
    siteContext: 'A permanently shadowed crater rim with intermittent sunlight, abrasive regolith, and delayed support from Earth.',
    crewDescription: 'Two astronauts share habitat operations, maintenance, science, and surface work.',
    missionWindow: 'Eight simulated surface cycles, with each cycle representing a meaningful operations planning window.',
    prePositionedEquipment: [
      'Pressurized habitat with oxygen scrubber and humidity recovery interfaces',
      'Deployable solar array and battery storage bus',
      'Regolith sampling tools and a compact science instrument suite',
      'Emergency shelter, suit maintenance bay, and surface communications relay',
    ],
    communicationsAssumption: 'Crew receives delayed guidance from Earth and must resolve immediate incidents locally.',
    availableSpares: 'A limited cache of structural parts, filters, seals, and power electronics is represented as spare kits.',
    successCriteria: [
      'Reach the end of the mission window with crew safety and habitat integrity above abort thresholds.',
      'Complete a habitat systems check and return a polar regolith sample.',
      'Keep essential reserves above their failure thresholds.',
    ],
    abortCriteria: [
      'Crew safety falls below 60%.',
      'Habitat integrity falls below 40%.',
      'Oxygen, water, food, or power reaches zero.',
    ],
    modelLimits: [
      'This is an educational operations model, not flight-certified mission planning software.',
      'Resource units are intentionally coarse and represent planning reserves rather than measured engineering telemetry.',
      'Crew health, navigation, communications latency, and hardware redundancy are abstracted into condition indices.',
    ],
  },
  resources: {
    oxygen: {
      label: 'Oxygen reserve',
      unit: 'crew-days',
      capacity: 100,
      starting: 88,
      thresholds: { reserve: 70, warning: 45, critical: 20, failure: 0 },
      description: 'Breathable oxygen reserve after scrubber balancing.',
    },
    water: {
      label: 'Potable water',
      unit: 'L',
      capacity: 80,
      starting: 64,
      thresholds: { reserve: 50, warning: 30, critical: 12, failure: 0 },
      description: 'Drinking, hygiene, and life-support process water.',
    },
    food: {
      label: 'Food reserve',
      unit: 'crew-days',
      capacity: 80,
      starting: 68,
      thresholds: { reserve: 55, warning: 35, critical: 14, failure: 0 },
      description: 'Packaged crew-day equivalents available in the habitat.',
    },
    power: {
      label: 'Battery reserve',
      unit: 'kWh',
      capacity: 100,
      starting: 42,
      thresholds: { reserve: 55, warning: 30, critical: 12, failure: 0 },
      description: 'Usable stored energy before non-critical loads must be shed.',
    },
    materials: {
      label: 'Spare parts',
      unit: 'kits',
      capacity: 80,
      starting: 62,
      thresholds: { reserve: 45, warning: 25, critical: 10, failure: 0 },
      description: 'Maintenance and construction kits available to the crew.',
    },
  },
  environment: [
    { cycle: 1, illumination: 'limited', externalTemperatureC: -178, dustExposure: 1, radiation: 'nominal' },
    { cycle: 2, illumination: 'partial', externalTemperatureC: -164, dustExposure: 2, radiation: 'nominal' },
    { cycle: 3, illumination: 'strong', externalTemperatureC: -122, dustExposure: 3, radiation: 'elevated', operationalConstraint: 'Surface work is viable, but dust ingress risk is elevated.' },
    { cycle: 4, illumination: 'strong', externalTemperatureC: -108, dustExposure: 2, radiation: 'elevated' },
    { cycle: 5, illumination: 'partial', externalTemperatureC: -151, dustExposure: 4, radiation: 'high', operationalConstraint: 'Radiation sheltering is recommended during external operations.' },
    { cycle: 6, illumination: 'limited', externalTemperatureC: -181, dustExposure: 2, radiation: 'nominal', operationalConstraint: 'Power conservation is favored during the dark interval.' },
    { cycle: 7, illumination: 'partial', externalTemperatureC: -169, dustExposure: 3, radiation: 'nominal' },
    { cycle: 8, illumination: 'strong', externalTemperatureC: -116, dustExposure: 2, radiation: 'elevated' },
  ],
}
