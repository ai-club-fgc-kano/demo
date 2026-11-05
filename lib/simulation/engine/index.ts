/**
 * Public simulation entry point. React components and hooks import from here;
 * subsystem modules stay internal so callers cannot bypass validation.
 */
export { advanceCycle } from './advance-cycle'
export { chooseEvent } from './resolve-event'
export { createInitialState } from './create-initial-state'
export { getAvailableActions, validateAction } from './available-actions'

export type {
  ActionId,
  ConditionSnapshot,
  EventChoice,
  MissionDefinition,
  MissionEvent,
  MissionObjective,
  MissionObjectiveId,
  MissionState,
  ModuleDefinition,
  ModuleId,
  OperationDefinition,
  OperationId,
  QueuedModule,
  ResourceDelta,
  ResourceKey,
} from '@/lib/missions/lunar-south-pole/types'
