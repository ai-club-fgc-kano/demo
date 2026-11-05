import { moduleCatalog, isModuleId } from '@/lib/missions/lunar-south-pole/modules'
import { clamp } from '../domain/resources'
import { setObjectiveCompletion } from './evaluate-objectives'
import type { ActionId, MissionState, ResourceKey } from '@/lib/missions/lunar-south-pole/types'

const INSPECTION_READINESS_GAIN = 2
const SCIENCE_RESEARCH = 6
const EVA_RESEARCH = 10
const SCIENCE_POWER_COST = 4
const SCIENCE_READINESS_COST = 2
const EVA_READINESS_COST = 7
const CONSERVE_POWER_GAIN = 7
const CONSERVE_EFFICIENCY_GAIN = 4
const REPAIR_MATERIAL_COST = 7
const REPAIR_INTEGRITY_GAIN = 7

/**
 * Apply the effects of an operation that already passed validation. The caller
 * owns the cloned state, so mutation here cannot leak into the previous state.
 */
export function applyPlannedOperation(state: MissionState, action: ActionId): void {
  if (isModuleId(action)) {
    const moduleDefinition = moduleCatalog[action]

    for (const [key, amount] of Object.entries(moduleDefinition.cost)) {
      state[key as ResourceKey] = clamp(state[key as ResourceKey] - (amount ?? 0))
    }

    state.queued.push({ id: action, readyCycle: state.cycle + moduleDefinition.delayCycles })
    state.log.push({
      cycle: state.cycle,
      kind: 'action',
      title: `${moduleDefinition.name} scheduled`,
      detail: `Commissioning in ${moduleDefinition.delayCycles} cycle${moduleDefinition.delayCycles > 1 ? 's' : ''}.`,
    })
    return
  }

  switch (action) {
    case 'inspect':
      setObjectiveCompletion(state, 'systems-check', true)
      state.readiness = clamp(state.readiness + INSPECTION_READINESS_GAIN)
      state.log.push({
        cycle: state.cycle,
        kind: 'action',
        title: 'Habitat systems check complete',
        detail: 'Pressure, air revitalization, thermal loops, and water lines are nominal.',
        tone: 'good',
      })
      return

    case 'science':
    case 'eva': {
      const isEva = action === 'eva'
      state.research += isEva ? EVA_RESEARCH : SCIENCE_RESEARCH
      setObjectiveCompletion(state, 'sample-return', isEva)
      state.power = clamp(state.power - SCIENCE_POWER_COST)
      state.readiness = clamp(state.readiness - (isEva ? EVA_READINESS_COST : SCIENCE_READINESS_COST))
      state.log.push({
        cycle: state.cycle,
        kind: 'action',
        title: isEva ? 'Sample traverse complete' : 'Science package prepared',
        detail: isEva
          ? 'A polar regolith sample was secured. Dust exposure increased maintenance load.'
          : 'The instrument suite is calibrated for the next window.',
        tone: 'good',
      })
      return
    }

    case 'conserve':
      state.efficiency = clamp(state.efficiency + CONSERVE_EFFICIENCY_GAIN)
      state.power = clamp(state.power + CONSERVE_POWER_GAIN)
      state.log.push({
        cycle: state.cycle,
        kind: 'action',
        title: 'Essential loads prioritized',
        detail: 'Non-critical science and habitat loads were throttled for this cycle.',
      })
      return

    case 'repair':
      state.materials = clamp(state.materials - REPAIR_MATERIAL_COST)
      state.integrity = clamp(state.integrity + REPAIR_INTEGRITY_GAIN)
      state.log.push({
        cycle: state.cycle,
        kind: 'action',
        title: 'Preventive maintenance complete',
        detail: 'Crew inspected seals, filters, and thermal interfaces.',
        tone: 'good',
      })
      return
  }
}
