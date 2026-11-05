import { Moon } from 'lucide-react'

export function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background">
        <Moon />
      </div>
      <div>
        <p className="text-sm font-semibold tracking-tight">OUTPOST</p>
        <p className="text-[10px] uppercase tracking-[.18em] text-muted-foreground">Mission trainer</p>
      </div>
    </div>
  )
}
