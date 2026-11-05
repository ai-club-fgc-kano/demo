'use client'

import { useCallback, useReducer } from 'react'
import {
  advanceCycle,
  chooseEvent,
  createInitialState,
  type ActionId,
  type MissionState,
} from '@/lib/simulation/engine'

type MissionCommand =
  | { type: 'advance'; action: ActionId | null }
  | { type: 'resolve-event'; choiceId: string }
  | { type: 'reset' }

function missionReducer(state: MissionState, command: MissionCommand): MissionState {
  switch (command.type) {
    case 'advance':
      return advanceCycle(state, command.action)
    case 'resolve-event':
      return chooseEvent(state, command.choiceId)
    case 'reset':
      return createInitialState()
  }
}

export function useMission() {
  const [state, dispatch] = useReducer(missionReducer, undefined, () => createInitialState())

  const advance = useCallback((action: ActionId | null) => {
    dispatch({ type: 'advance', action })
  }, [])

  const resolveEvent = useCallback((choiceId: string) => {
    dispatch({ type: 'resolve-event', choiceId })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: 'reset' })
  }, [])

  return { state, advance, resolveEvent, reset }
}
