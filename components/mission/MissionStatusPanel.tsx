import { Check } from 'lucide-react'
import { evaluateCondition, type ConditionBand } from '@/lib/simulation/domain/units'
import type { MissionState } from '@/lib/missions/lunar-south-pole/types'

const bandStyles: Record<ConditionBand, string> = {
  nominal: 'text-emerald-600 dark:text-emerald-400',
  watch: 'text-amber-600 dark:text-amber-400',
  critical: 'text-destructive',
}

function Metric({ label, value, suffix = '%' }: { label: string; value: number; suffix?: string }) {
  const band = evaluateCondition(value)

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <span className={`text-[10px] uppercase tracking-wider ${bandStyles[band]}`}>{band}</span>
      </div>
      <p className="mt-1 text-lg font-semibold">
        {value}
        <span className="text-xs font-normal text-muted-foreground">{suffix}</span>
      </p>
    </div>
  )
}

export function MissionStatusPanel({ state }: { state: MissionState }) {
  return (
    <aside className="h-fit rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-20">
      <p className="text-xs uppercase tracking-[.16em] text-muted-foreground">Mission status</p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Metric label="Safety" value={state.safety} />
        <Metric label="Integrity" value={state.integrity} />
        <Metric label="Readiness" value={state.readiness} />
        <Metric label="Science" value={state.research} suffix=" pts" />
      </div>

      <div className="mt-6 border-t border-border pt-5">
        <p className="text-xs uppercase tracking-[.16em] text-muted-foreground">Objectives</p>
        <div className="mt-3 flex flex-col gap-3">
          {state.objectives.map(objective => (
            <div key={objective.id} className="flex gap-2 text-sm">
              <span
                className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border ${
                  objective.done
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border'
                }`}
              >
                {objective.done && <Check className="size-3" />}
              </span>
              <span className={objective.done ? 'text-muted-foreground line-through' : ''}>
                {objective.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
