import { operationIds } from '@/lib/missions/lunar-south-pole/actions'
import { moduleCatalog, moduleIds } from '@/lib/missions/lunar-south-pole/modules'
import { canAfford } from '../domain/resources'
import type { ActionId, MissionState } from '@/lib/missions/lunar-south-pole/types'

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
export function validateAction(state: MissionState, action: ActionId): string | null {
  if (!getAvailableActions(state).includes(action)) {
    return 'This operation is not available with the current crew, systems, or reserves.'
  }
  return null
}
