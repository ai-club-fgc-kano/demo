import type { MissionEvent } from './types'

/**
 * Baseline incident set carried over unchanged from the original engine.
 * These are still selected without state eligibility or cooldowns; Phase 3
 * replaces selection with seeded, state-dependent eligibility.
 */
export const lunarEvents: MissionEvent[] = [
  {
    id: 'dust',
    title: 'Lunar dust intrusion',
    description:
      'A seal inspection reports abrasive regolith inside the airlock vestibule. The next EVA could spread contamination into the habitat.',
    severity: 'warning',
    choices: [
      {
        id: 'clean',
        label: 'Run a full decontamination',
        detail: 'Use materials and time to protect the habitat seals.',
        effects: { materials: -8, power: -3 },
        safety: 5,
      },
      {
        id: 'limit',
        label: 'Limit airlock cycles',
        detail: 'Suspend non-essential surface operations until the next inspection.',
        effects: { research: -2 },
        safety: 1,
      },
    ],
  },
  {
    id: 'radiation',
    title: 'Solar-particle alert',
    description:
      'A fast radiation front is expected in the next operating window. The crew needs a deliberate shelter decision.',
    severity: 'critical',
    choices: [
      {
        id: 'shelter',
        label: 'Prepare the storm shelter',
        detail: 'Suspend science and move the crew into protected operations.',
        effects: { power: -7, food: -2 },
        safety: 8,
      },
      {
        id: 'expose',
        label: 'Continue surface work',
        detail: 'Complete the sample traverse, accepting additional exposure.',
        effects: { research: 8, readiness: -12 },
        safety: -12,
      },
    ],
  },
  {
    id: 'water',
    title: 'Water recovery anomaly',
    description:
      'The recovery loop is cycling below its expected efficiency. Reserve projections have dropped by one cycle.',
    severity: 'critical',
    choices: [
      {
        id: 'repair',
        label: 'Repair the recovery loop',
        detail: 'Spend spare parts to restore filtration performance.',
        effects: { materials: -12, power: -4 },
        safety: 7,
      },
      {
        id: 'ration',
        label: 'Apply crew rationing',
        detail: 'Reduce discretionary water use while diagnostics continue.',
        effects: { water: -5, readiness: -3 },
        safety: 1,
      },
    ],
  },
]
