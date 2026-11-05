export type ResourceUnit = 'kWh' | 'L' | 'crew-days' | 'kits'

export type ResourceThresholds = {
  reserve: number
  warning: number
  critical: number
  failure: number
}

export type MissionResourceDefinition = {
  label: string
  unit: ResourceUnit
  capacity: number
  starting: number
  thresholds: ResourceThresholds
  description: string
}

export type IlluminationAvailability = 'limited' | 'partial' | 'strong'
export type RadiationLevel = 'nominal' | 'elevated' | 'high'

export type EnvironmentCycle = {
  cycle: number
  illumination: IlluminationAvailability
  externalTemperatureC: number
  dustExposure: number
  radiation: RadiationLevel
  operationalConstraint?: string
}

export type MissionBrief = {
  purpose: string
  siteContext: string
  crewDescription: string
  missionWindow: string
  prePositionedEquipment: string[]
  communicationsAssumption: string
  availableSpares: string
  successCriteria: string[]
  abortCriteria: string[]
  modelLimits: string[]
}
