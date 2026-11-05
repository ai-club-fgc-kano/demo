'use client'

import { useState } from 'react'
import { LandingPage } from '@/components/landing/LandingPage'
import { MissionWorkspace } from '@/components/mission/MissionWorkspace'
import { useMission } from '@/hooks/use-mission'
import { useTheme } from '@/hooks/use-theme'

export default function MissionTrainer() {
  const [started, setStarted] = useState(false)
  const { dark, toggleTheme } = useTheme()
  const { state, advance, resolveEvent, reset } = useMission()

  if (!started) {
    return (
      <LandingPage
        dark={dark}
        onToggleTheme={toggleTheme}
        onStart={() => setStarted(true)}
      />
    )
  }

  return (
    <MissionWorkspace
      state={state}
      dark={dark}
      onToggleTheme={toggleTheme}
      onReset={reset}
      onAdvance={advance}
      onResolveEvent={resolveEvent}
    />
  )
}
