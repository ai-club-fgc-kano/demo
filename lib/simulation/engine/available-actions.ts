import { operationIds } from '@/lib/missions/lunar-south-pole/actions'
import { moduleCatalog, moduleIds } from '@/lib/missions/lunar-south-pole/modules'
import { canAfford } from '../domain/resources'
import type {
  ActionId,
  ActionValidationResult,
  MissionState,
} from '@/lib/missions/lunar-south-pole/types'

/**
 * Actions the learner may plan. This is a UI hint: `validateAction` re-checks
 * every condition inside the engine when an action is submitted.
 */
export function getAvailableActions(state: MissionState): ActionId[] {
  const actions: ActionId[] = [...operationIds]

  for (const id of moduleIds) {
    const alreadyBuilt = state.modules.includes(id)
    const alreadyQueued = state.queued.some(queued => queued.id === id)
    if (!alreadyBuilt && !alreadyQueued && canAfford(state, moduleCatalog[id].cost)) {
      actions.push(id)
    }
  }

  return actions
}

/** Returns a learner-facing reason when an action is not allowed, else null. */
export function validateAction(state: MissionState, action: ActionId): ActionValidationResult {
  if (getAvailableActions(state).includes(action)) {
    return { ok: true }
  }

  const isModule = moduleIds.includes(action as (typeof moduleIds)[number])
  return {
    ok: false,
    code: isModule ? 'insufficient-resources' : 'unavailable',
    message: isModule
      ? 'This module cannot be scheduled with the current reserves.'
      : 'This operation is not available with the current crew or systems.',
  }
}
