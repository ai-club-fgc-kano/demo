import type { ConditionSnapshot } from '@/lib/missions/lunar-south-pole/types'

const WINDOW = 8

function conditionScore(snapshot: ConditionSnapshot): number {
  return (snapshot.safety + snapshot.integrity + snapshot.readiness + snapshot.efficiency) / 4
}

type MissionConditionChartProps = {
  score: number
  history: ConditionSnapshot[]
}

export function MissionConditionChart({ score, history }: MissionConditionChartProps) {
  const recorded = history.slice(-WINDOW).map(conditionScore)
  const series = recorded.length > 1 ? recorded : [recorded[0] ?? score, recorded[0] ?? score]
  const line = series
    .map((value, index) => `${(index / Math.max(1, series.length - 1)) * 100},${100 - value}`)
    .join(' ')

  return (
    <div className="mb-4 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[.16em] text-muted-foreground">Mission condition</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Average of crew safety, habitat integrity, readiness and efficiency.
          </p>
        </div>
        <p className="text-2xl font-semibold">{score}%</p>
      </div>
      <div className="mt-4 h-16 overflow-hidden rounded-lg bg-muted/50">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
          <polyline
            points={line}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
            className="text-foreground"
          />
        </svg>
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
        <span>Recorded cycles {history[0]?.cycle ?? 1}–{history[history.length - 1]?.cycle ?? 1}</span>
        <span>Now</span>
      </div>
    </div>
  )
}
