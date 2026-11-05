import { isModuleId, moduleCatalog } from './modules'
import type { ActionId, OperationDefinition, OperationId, ResourceKey } from './types'

export const operationCatalog: Record<OperationId, OperationDefinition> = {
  inspect: {
    label: 'Inspect habitat',
    description: 'Verify pressure, air, water, and thermal systems.',
  },
  science: {
    label: 'Prepare science',
    description: 'Calibrate instruments without committing to an EVA.',
  },
  eva: {
    label: 'Surface traverse',
    description: 'Collect a regolith sample; adds dust exposure and science.',
  },
  conserve: {
    label: 'Conserve power',
    description: 'Throttle non-critical loads and build reserve.',
  },
  repair: {
    label: 'Preventive repair',
    description: 'Use spare parts to restore habitat integrity.',
  },
}

export const operationIds = Object.keys(operationCatalog) as OperationId[]

export function isOperationId(id: string): id is OperationId {
  return id in operationCatalog
}

export function describeCost(cost: Partial<Record<ResourceKey, number>>): string {
  return Object.entries(cost)
    .map(([key, amount]) => `${amount} ${key}`)
    .join(' · ')
}

/** Presentation copy for any action, derived from the mission catalogs. */
export function describeAction(id: ActionId): { label: string; detail: string } {
  if (isModuleId(id)) {
    const moduleDefinition = moduleCatalog[id]
    return {
      label: `Build ${moduleDefinition.name}`,
      detail: `${moduleDefinition.description} Cost: ${describeCost(moduleDefinition.cost)}`,
    }
  }

  const operation = operationCatalog[id]
  return { label: operation.label, detail: operation.description }
}
