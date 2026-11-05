import Image from 'next/image'
import { Moon, Sun } from 'lucide-react'
import { Brand } from '@/components/layout/Brand'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'

type LandingPageProps = {
  dark: boolean
  onToggleTheme: () => void
  onStart: () => void
}

export function LandingPage({ dark, onToggleTheme, onStart }: LandingPageProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Brand />
        <IconButton label="Toggle theme" onClick={onToggleTheme}>
          {dark ? <Sun /> : <Moon />}
        </IconButton>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-foreground" />
          Browser-based mission simulation
        </p>

        <div className="grid gap-10 lg:grid-cols-[1fr_.9fr] lg:items-center">
          <div>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-.06em] sm:text-7xl">
              Run a lunar outpost.
              <br />
              <span className="text-muted-foreground">Learn by doing.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Balance life support, energy, maintenance, crew readiness, and science across a finite
              surface mission.
            </p>
            <Button
              type="button"
              size="lg"
              onClick={onStart}
              className="mt-9 min-h-12 rounded-lg px-5 text-sm font-medium"
            >
              Start simulation
            </Button>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-card">
            <Image
              src="/lunar-surface.png"
              alt="A lunar south pole surface habitat"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover grayscale"
            />
          </div>
        </div>
      </section>
    </main>
  )
}
