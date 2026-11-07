import { Cloud, Radiation, Snowflake, Sun } from 'lucide-react'
import type { EnvironmentCycle } from '@/lib/missions/lunar-south-pole/contract'

const illuminationLabels = {
  limited: 'Limited light',
  partial: 'Partial light',
  strong: 'Strong light',
} as const

const radiationLabels = {
  nominal: 'Nominal radiation',
  elevated: 'Elevated radiation',
  high: 'High radiation',
} as const

function formatTemperature(value: number): string {
  return `${value > 0 ? '+' : ''}${value}°C exterior`
}

export function MissionEnvironmentCard({ environment }: { environment: EnvironmentCycle }) {
  return (
    <section className="mb-6 rounded-xl border border-border bg-card/70 p-4" aria-labelledby="environment-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[.18em] text-muted-foreground">
            Current environment
          </p>
          <h2 id="environment-heading" className="mt-1 text-sm font-medium">
            Cycle {environment.cycle} surface conditions
          </h2>
        </div>
        {environment.operationalConstraint ? (
          <p className="max-w-sm text-xs leading-5 text-muted-foreground">
            {environment.operationalConstraint}
          </p>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <EnvironmentMetric icon={environment.illumination === 'strong' ? Sun : Cloud} label="Illumination" value={illuminationLabels[environment.illumination]} />
        <EnvironmentMetric icon={Snowflake} label="Exterior" value={formatTemperature(environment.externalTemperatureC)} />
        <EnvironmentMetric icon={Cloud} label="Dust exposure" value={`${environment.dustExposure}/100`} />
        <EnvironmentMetric icon={Radiation} label="Radiation" value={radiationLabels[environment.radiation]} />
      </div>
    </section>
  )
}

function EnvironmentMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Sun
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/70 bg-background/40 px-3 py-2.5">
      <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}
