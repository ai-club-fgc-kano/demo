'use client'

import { useState } from 'react'
import { describeAction } from '@/lib/missions/lunar-south-pole/actions'
import { getAvailableActions } from '@/lib/simulation/engine'
import type { ActionId, MissionState } from '@/lib/missions/lunar-south-pole/types'
import { lunarSouthPoleMission } from '@/lib/missions/lunar-south-pole/definition'
import { MissionBriefing } from './MissionBriefing'
import { MissionConditionChart } from './MissionConditionChart'
import { MissionEnvironmentCard } from './MissionEnvironmentCard'
import { MissionHeader } from './MissionHeader'
import { MissionStatusPanel } from './MissionStatusPanel'
import { OperationPanel } from './OperationPanel'
import { ResourceTelemetry } from './ResourceTelemetry'

type MissionWorkspaceProps = {
  state: MissionState
  dark: boolean
  onToggleTheme: () => void
  onReset: () => void
  onAdvance: (action: ActionId | null) => void
  onResolveEvent: (choiceId: string) => void
}

function recommendAction(actions: ActionId[]): ActionId {
  if (actions.includes('conserve')) return 'conserve'
  if (actions.includes('repair')) return 'repair'
  if (actions.includes('inspect')) return 'inspect'
  return actions[0]
}

export function MissionWorkspace({
  state,
  dark,
  onToggleTheme,
  onReset,
  onAdvance,
  onResolveEvent,
}: MissionWorkspaceProps) {
  const [selected, setSelected] = useState<ActionId | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [showGuidance, setShowGuidance] = useState(false)

  const actions = getAvailableActions(state)
  const active = state.status === 'active'
  const conditionScore = Math.round(
    (state.safety + state.integrity + state.readiness + state.efficiency) / 4,
  )
  const recommendedLabel = describeAction(recommendAction(actions)).label

  function handleAdvance() {
    onAdvance(selected)
    setSelected(null)
    setShowGuidance(false)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <MissionHeader cycle={state.cycle} dark={dark} onToggleTheme={onToggleTheme} onReset={onReset} />

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_320px] lg:py-8">
        <section>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[.18em] text-muted-foreground">
                Lunar south pole / surface outpost
              </p>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Keep the crew safe. Complete the work.
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Choose one primary operation per cycle. Systems then run, resources shift, and an
                incident may require a second decision.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className={`size-2 rounded-full ${active ? 'bg-foreground' : 'bg-destructive'}`} />
              {state.status}
            </div>
          </div>

          <MissionBriefing
            brief={lunarSouthPoleMission.brief}
            crewSize={lunarSouthPoleMission.crewSize}
            durationCycles={lunarSouthPoleMission.durationCycles}
          />
          <MissionConditionChart score={conditionScore} history={state.history} />
          <MissionEnvironmentCard environment={state.environment} />
          <ResourceTelemetry state={state} />

          <OperationPanel
            state={state}
            actions={actions}
            selected={selected}
            showHint={showHint}
            showGuidance={showGuidance}
            recommendedLabel={recommendedLabel}
            onSelect={setSelected}
            onToggleHint={() => setShowHint(current => !current)}
            onToggleGuidance={() => setShowGuidance(current => !current)}
            onAdvance={handleAdvance}
            onChooseEvent={onResolveEvent}
          />
        </section>

        <MissionStatusPanel state={state} />
      </div>
    </main>
  )
}
