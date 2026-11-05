import { Moon, RotateCcw, Sun } from 'lucide-react'
import { Brand } from '@/components/layout/Brand'
import { IconButton } from '@/components/ui/icon-button'

type MissionHeaderProps = {
  cycle: number
  dark: boolean
  onToggleTheme: () => void
  onReset: () => void
}

export function MissionHeader({ cycle, dark, onToggleTheme, onReset }: MissionHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Brand />
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-muted-foreground sm:block">
            Surface operations · Cycle {String(cycle).padStart(2, '0')}
          </span>
          <IconButton label="Toggle theme" onClick={onToggleTheme}>
            {dark ? <Sun /> : <Moon />}
          </IconButton>
          <IconButton label="Reset mission" onClick={onReset}>
            <RotateCcw />
          </IconButton>
        </div>
      </div>
    </header>
  )
}
