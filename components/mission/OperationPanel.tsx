import { Activity, CircleHelp, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { describeAction, getActionDefinition } from '@/lib/missions/lunar-south-pole/actions'
import type { ActionId, MissionState } from '@/lib/missions/lunar-south-pole/types'
import { EventPanel } from './EventPanel'

type OperationPanelProps = {
  state: MissionState
  actions: ActionId[]
  selected: ActionId | null
  showHint: boolean
  showGuidance: boolean
  recommendedLabel: string
  onSelect: (action: ActionId) => void
  onToggleHint: () => void
  onToggleGuidance: () => void
  onAdvance: () => void
  onChooseEvent: (choiceId: string) => void
}

export function OperationPanel({
  state,
  actions,
  selected,
  showHint,
  showGuidance,
  recommendedLabel,
  onSelect,
  onToggleHint,
  onToggleGuidance,
  onAdvance,
  onChooseEvent,
}: OperationPanelProps) {
  const active = state.status === 'active'

  return (
    <div className="mt-6 rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[.16em] text-muted-foreground">Primary operation</p>
          <h2 className="mt-1 text-lg font-semibold">What should the crew prioritize?</h2>
        </div>
        <IconButton label="Show mission hint" onClick={onToggleHint}>
          <CircleHelp />
        </IconButton>
      </div>

      {showHint && (
        <div className="mt-4 rounded-xl border border-primary/40 bg-primary/5 p-3 text-sm leading-6 text-muted-foreground">
          <span className="font-medium text-foreground">Hint:</span> protect the weakest system first.
          Conserve power when the reserve is low, repair when integrity is falling, and inspect before
          committing to science.
        </div>
      )}

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {actions.map(action => {
          const { label, detail } = describeAction(action)
          const definition = getActionDefinition(action)
          const isSelected = selected === action

          return (
            <button
              key={action}
              type="button"
              onClick={() => onSelect(action)}
              aria-pressed={isSelected}
              className={`rounded-xl border p-3 text-left transition ${
                isSelected
                  ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                  : 'border-border hover:border-primary/50 hover:bg-accent/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
                  <p className="mt-2 text-[11px] font-medium uppercase tracking-[.12em] text-muted-foreground">
                    {definition.category} · {definition.crewHours} crew-hours
                  </p>
                </div>
                <Activity />
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button
          type="button"
          onClick={onAdvance}
          disabled={!active || !selected || Boolean(state.pendingEvent)}
          className="min-h-11 flex-1 rounded-lg px-4 text-sm font-medium"
        >
          Advance cycle
        </Button>
        {(state.log.length > 1 || !active) && (
          <Button
            type="button"
            variant="outline"
            onClick={onToggleGuidance}
            className="min-h-11 gap-2 rounded-lg px-4 text-sm font-medium"
          >
            <Check />
            {showGuidance ? 'Hide guidance' : 'See recommended response'}
          </Button>
        )}
      </div>

      {showGuidance && (
        <div className="mt-3 rounded-xl border border-primary/50 bg-primary/5 p-3 text-sm leading-6">
          <p className="font-medium">Operational guidance</p>
          <p className="mt-1 text-muted-foreground">
            The most appropriate next priority is{' '}
            <span className="font-medium text-foreground">{recommendedLabel}</span>. This recommendation
            protects the current weakest mission metric; your choice can still be valid if it supports a
            different objective.
          </p>
        </div>
      )}

      {state.pendingEvent && <EventPanel event={state.pendingEvent} onChoose={onChooseEvent} />}
    </div>
  )
}
