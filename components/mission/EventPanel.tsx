import { CircleAlert } from 'lucide-react'
import type { MissionEvent } from '@/lib/missions/lunar-south-pole/types'

type EventPanelProps = {
  event: MissionEvent
  onChoose: (choiceId: string) => void
}

export function EventPanel({ event, onChoose }: EventPanelProps) {
  return (
    <div className="mt-5 rounded-xl border border-primary/50 bg-background p-4">
      <div className="flex gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
          <CircleAlert className="size-4" />
        </div>
        <div>
          <p className="text-sm font-semibold">{event.title}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{event.description}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {event.choices.map(choice => (
          <button
            key={choice.id}
            type="button"
            onClick={() => onChoose(choice.id)}
            className="rounded-lg border border-border p-3 text-left transition hover:border-primary/60 hover:bg-accent"
          >
            <p className="text-sm font-medium">{choice.label}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{choice.detail}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
