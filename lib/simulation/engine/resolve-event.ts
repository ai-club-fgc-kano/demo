import { applyDelta, clamp } from '../domain/resources'
import type { MissionState } from '@/lib/missions/lunar-south-pole/types'

/**
 * Resolve the pending incident with one of its declared choices. An unknown
 * choice or absent incident returns the state untouched, so a stale UI event
 * cannot partially mutate the mission.
 */
export function chooseEvent(input: MissionState, choiceId: string): MissionState {
  const event = input.pendingEvent
  if (!event) return input

  const choice = event.choices.find(candidate => candidate.id === choiceId)
  if (!choice) return input

  const state = structuredClone(input)
  applyDelta(state, choice.effects)
  state.safety = clamp(state.safety + choice.safety)
  state.pendingEvent = null
  state.log.push({
    cycle: state.cycle,
    kind: 'event',
    title: `${event.title}: ${choice.label}`,
    detail: choice.detail,
    tone: choice.safety >= 0 ? 'good' : 'warning',
  })

  return state
}
