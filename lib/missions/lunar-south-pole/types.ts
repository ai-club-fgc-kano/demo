import type { LogEntry, MissionStatus } from '@/lib/simulation/domain/types'
import type {
  EnvironmentCycle,
  MissionBrief,
  MissionResourceDefinition,
} from './contract'

/**
 * Lunar south-pole mission contract.
 *
 * The scenario currently has a single mission, so its state shape is defined
 * here rather than being generic over a mission parameter. Phase 2 replaces the
 * flat resource fields with unit-aware capacity/rate models; until then the
 * numbers are documented "reserve points" and are not physical units.
 */

export type ResourceKey = 'oxygen' | 'water' | 'food' | 'power' | 'materials'

export type ModuleId = 'solar' | 'battery' | 'recycler' | 'shielding'

export type OperationId = 'inspect' | 'science' | 'eva' | 'conserve' | 'repair'

export type ActionId = ModuleId | OperationId

export type MissionObjectiveId = 'systems-check' | 'sample-return' | 'crew-safety'

export type ResourceDelta = Partial<Record<ResourceKey | 'research' | 'readiness', number>>

export type EventChoice = {
  id: string
  label: string
  detail: string
  effects: ResourceDelta
  /** Change applied to the crew-safety index in addition to `effects`. */
  safety: number
}

export type MissionEvent = {
  id: string
  title: string
  description: string
  severity: 'warning' | 'critical'
  choices: EventChoice[]
}

export type ModuleDefinition = {
  name: string
  description: string
  cost: Partial<Record<ResourceKey, number>>
  effect: string
  delayCycles: number
}

export type OperationDefinition = {
  label: string
  description: string
}

export type QueuedModule = {
  id: ModuleId
  readyCycle: number
}

export type MissionObjective = {
  id: MissionObjectiveId
  label: string
  done: boolean
}

/** One recorded condition reading per resolved cycle, used by the condition chart. */
export type ConditionSnapshot = {
  cycle: number
  safety: number
  integrity: number
  readiness: number
  efficiency: number
}

export type MissionRunMetadata = {
  seed: number
  scenarioVersion: string
  cycleLengthHours: number
}

export type MissionOutcome = {
  status: Extract<MissionStatus, 'success' | 'failed'>
  title: string
  detail: string
} | null

export type MissionState = {
  run: MissionRunMetadata
  environment: EnvironmentCycle
  outcome: MissionOutcome
  cycle: number
  oxygen: number
  water: number
  food: number
  power: number
  materials: number
  safety: number
  integrity: number
  research: number
  efficiency: number
  readiness: number
  status: MissionStatus
  modules: ModuleId[]
  queued: QueuedModule[]
  pendingEvent: MissionEvent | null
  log: LogEntry[]
  objectives: MissionObjective[]
  history: ConditionSnapshot[]
}

export type MissionDefinition = {
  id: string
  name: string
  site: string
  crewSize: number
  /** Number of cycles in the training window; the engine never hard-codes it. */
  durationCycles: number
  startingResources: Record<ResourceKey, number>
  startingCondition: Omit<ConditionSnapshot, 'cycle'>
  objectives: { id: MissionObjectiveId; label: string }[]
  events: MissionEvent[]
  introLog: { title: string; detail: string }
  brief: MissionBrief
  resources: Record<ResourceKey, MissionResourceDefinition>
  environment: EnvironmentCycle[]
}
