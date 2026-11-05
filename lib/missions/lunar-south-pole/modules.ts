import type { MissionState, ModuleDefinition, ModuleId } from './types'

export const moduleCatalog: Record<ModuleId, ModuleDefinition> = {
  solar: {
    name: 'Solar array',
    description: 'Improves generation during illuminated cycles.',
    cost: { materials: 20, power: 4 },
    effect: '+8 generation',
    delayCycles: 1,
  },
  battery: {
    name: 'Battery bank',
    description: 'Extends reserve capacity for dark periods.',
    cost: { materials: 18, power: 3 },
    effect: '+24 reserve capacity',
    delayCycles: 1,
  },
  recycler: {
    name: 'Water recovery loop',
    description: 'Recovers potable water from humidity and hygiene waste.',
    cost: { materials: 22, power: 5 },
    effect: '18% recovery efficiency',
    delayCycles: 1,
  },
  shielding: {
    name: 'Storm shelter',
    description: 'Creates a protected zone for radiation alerts.',
    cost: { materials: 28 },
    effect: 'reduces exposure during alerts',
    delayCycles: 2,
  },
}

export const moduleIds = Object.keys(moduleCatalog) as ModuleId[]

export function isModuleId(id: string): id is ModuleId {
  return id in moduleCatalog
}

export function hasModule(state: Pick<MissionState, 'modules'>, id: ModuleId): boolean {
  return state.modules.includes(id)
}
