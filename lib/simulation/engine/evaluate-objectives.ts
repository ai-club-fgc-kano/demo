import type { MissionObjectiveId, MissionState } from '@/lib/missions/lunar-south-pole/types'

const CREW_SAFETY_TARGET = 60

export function setObjectiveCompletion(state: MissionState, id: MissionObjectiveId, done: boolean): void {
  const objective = state.objectives.find(candidate => candidate.id === id)
  if (objective) objective.done = done
}

/** Objectives whose completion is a pure function of the current state. */
export function evaluateStateObjectives(state: MissionState): void {
  setObjectiveCompletion(state, 'crew-safety', state.safety >= CREW_SAFETY_TARGET)
}
