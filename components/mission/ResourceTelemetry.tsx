import { Droplets, Leaf, Wind, Wrench, Zap, type LucideIcon } from 'lucide-react'
import { estimateCyclesRemaining, resourceTelemetry } from '@/lib/missions/lunar-south-pole/telemetry'
import type { MissionState, ResourceKey } from '@/lib/missions/lunar-south-pole/types'

const resourceIcons: Record<ResourceKey, LucideIcon> = {
  oxygen: Wind,
  water: Droplets,
  food: Leaf,
  power: Zap,
  materials: Wrench,
}

const LOW_RESERVE = 25

function formatValue(value: number, unit: string): string {
  return unit === '%' ? `${value}%` : `${value}`
}

export function ResourceTelemetry({ state }: { state: MissionState }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {resourceTelemetry.map(({ key, label, unit }) => {
        const Icon = resourceIcons[key]
        const value = state[key]
        const low = value < LOW_RESERVE
        const remaining = estimateCyclesRemaining(state, key)

        return (
          <div key={key} className="rounded-xl border border-border bg-card p-3">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs">{label}</span>
              <Icon className="size-4" />
            </div>
            <p className={`mt-3 text-xl font-semibold ${low ? 'text-destructive' : ''}`}>
              {formatValue(value, unit)}
              {unit !== '%' && <span className="ml-1 text-xs font-normal text-muted-foreground">{unit}</span>}
            </p>
            <div className="mt-2 h-1 rounded-full bg-muted">
              {/* The baseline model stores every resource as a 0–100 index; Phase 2 uses real capacities. */}
              <div
                className="h-1 rounded-full bg-foreground transition-all duration-700"
                style={{ width: `${Math.min(100, value)}%` }}
              />
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">
              ≈{remaining} cycles at current draw
            </p>
          </div>
        )
      })}
    </div>
  )
}
