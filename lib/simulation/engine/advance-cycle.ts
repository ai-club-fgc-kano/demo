import { moduleCatalog } from '@/lib/missions/lunar-south-pole/modules'
import { getMission } from '@/lib/missions/registry'
import { selectIncident } from '../events/select-incident'
import { resolveCrewSafetyDelta } from '../systems/crew'
import { resolveHabitatIntegrityDelta } from '../systems/habitat'
import { resolveLifeSupportDelta } from '../systems/life-support'
import { getBatteryCapacity, resolvePowerBalance, type PowerBalance } from '../systems/power'
import { clamp } from '../domain/resources'
import { applyPlannedOperation } from './apply-operation'
import { validateAction } from './available-actions'
import { evaluateOutcome } from './evaluate-outcome'
import { evaluateStateObjectives } from './evaluate-objectives'
import type { ActionId, MissionDefinition, MissionState } from '@/lib/missions/lunar-south-pole/types'

const PASSIVE_RESEARCH = 2

/**
 * Resolve one mission cycle.
 *
 * Documented order (see docs/architecture.md):
 *   1. Reject invalid submissions without mutating reserves, cycle, or objectives.
 *   2. Apply the planned operation's costs and direct effects.
 *   3. Advance the mission clock and commission any module that is ready.
 *   4. Run passive subsystem balances (power, life support, habitat, crew).
 *   5. Evaluate state-derived objectives.
 *   6. Select an eligible incident.
 *   7. Evaluate terminal conditions and file the cycle report.
 *   8. Record the condition snapshot used by the condition chart.
 *
 * The transition is pure: the input state is cloned and never mutated.
 */
export function advanceCycle(
  input: MissionState,
  action: ActionId | null,
  mission: MissionDefinition = getMission(),
): MissionState {
  const state = structuredClone(input)

  if (state.status !== 'active' || state.pendingEvent) return state

  if (action) {
    const rejection = validateAction(state, action)
    if (rejection) {
      state.log.push({
        cycle: state.cycle,
        kind: 'system',
        title: 'Operation unavailable',
        detail: rejection,
        tone: 'warning',
      })
      return state
    }
    applyPlannedOperation(state, action)
  }

  state.cycle += 1
  state.environment = getEnvironmentCycle(mission, state.cycle)
  commissionReadyModules(state)
  const balance = runSystems(state)

  const incident = selectIncident(state, mission)
  if (incident) state.pendingEvent = incident

  recordCondition(state)

  const outcome = evaluateOutcome(state, mission)
  if (outcome === 'failed') {
    state.status = 'failed'
    state.outcome = {
      status: 'failed',
      title: 'Mission aborted',
      detail: 'A critical crew or habitat threshold was crossed.',
    }
    state.log.push({
      cycle: state.cycle,
      kind: 'system',
      title: 'Mission aborted',
      detail: 'A critical crew or habitat threshold was crossed.',
      tone: 'critical',
    })
  } else if (outcome === 'success') {
    state.status = 'success'
    state.outcome = {
      status: 'success',
      title: 'Surface objectives secured',
      detail: 'The crew completed the training window and is ready for ascent preparation.',
    }
    state.log.push({
      cycle: state.cycle,
      kind: 'system',
      title: 'Surface objectives secured',
      detail: 'The crew completed the training window and is ready for ascent preparation.',
      tone: 'good',
    })
  } else {
    state.log.push({
      cycle: state.cycle,
      kind: 'system',
      title: 'Cycle report filed',
      detail: `Power ${balance.generation} generated / ${balance.demand} demanded · reserves updated.`,
    })
  }

  return state
}

function getEnvironmentCycle(mission: MissionDefinition, cycle: number) {
  const environment = mission.environment.find(entry => entry.cycle === cycle)
  return environment ?? mission.environment[mission.environment.length - 1]
}

function commissionReadyModules(state: MissionState): void {
  state.queued = state.queued.filter(queued => {
    if (queued.readyCycle > state.cycle) return true

    const moduleDefinition = moduleCatalog[queued.id]
    state.modules.push(queued.id)
    state.log.push({
      cycle: state.cycle,
      kind: 'system',
      title: `${moduleDefinition.name} commissioned`,
      detail: moduleDefinition.effect,
      tone: 'good',
    })
    return false
  })
}

function runSystems(state: MissionState): PowerBalance {
  const balance = resolvePowerBalance(state)
  state.power = clamp(state.power + balance.net, 0, getBatteryCapacity(state))

  const lifeSupport = resolveLifeSupportDelta(state)
  state.oxygen = clamp(state.oxygen + lifeSupport.oxygen)
  state.water = clamp(state.water + lifeSupport.water)
  state.food = clamp(state.food + lifeSupport.food)

  state.integrity = clamp(state.integrity + resolveHabitatIntegrityDelta(state))
  state.safety = clamp(state.safety + resolveCrewSafetyDelta(state))

  evaluateStateObjectives(state)
  state.research += PASSIVE_RESEARCH

  return balance
}

function recordCondition(state: MissionState): void {
  state.history.push({
    cycle: state.cycle,
    safety: state.safety,
    integrity: state.integrity,
    readiness: state.readiness,
    efficiency: state.efficiency,
  })
}
