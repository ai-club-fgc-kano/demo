'use client'

import { useState } from 'react'
import type { MissionBrief } from '@/lib/missions/lunar-south-pole/contract'

type MissionBriefingProps = {
  brief: MissionBrief
  crewSize: number
  durationCycles: number
}

export function MissionBriefing({ brief, crewSize, durationCycles }: MissionBriefingProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <section className="mb-6 rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm sm:p-5" aria-labelledby="mission-briefing-title">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[.18em] text-muted-foreground">Training scenario</p>
          <h2 id="mission-briefing-title" className="mt-1 text-base font-semibold tracking-tight">
            Pre-deployed south-pole outpost
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{brief.purpose}</p>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-expanded={expanded}
          aria-controls="mission-briefing-details"
          onClick={() => setExpanded(current => !current)}
        >
          {expanded ? 'Hide brief' : 'Read brief'}
        </button>
      </div>

      <div className="mt-4 grid gap-3 text-xs text-muted-foreground sm:grid-cols-3">
        <p><span className="font-medium text-foreground">Crew:</span> {crewSize} astronauts</p>
        <p><span className="font-medium text-foreground">Window:</span> {durationCycles} cycles</p>
        <p><span className="font-medium text-foreground">Context:</span> Fictional educational scenario</p>
      </div>

      {expanded ? (
        <div id="mission-briefing-details" className="mt-5 grid gap-5 border-t border-border/70 pt-5 text-sm lg:grid-cols-2">
          <div>
            <h3 className="font-medium text-foreground">Site and operations</h3>
            <p className="mt-2 leading-6 text-muted-foreground">{brief.siteContext}</p>
            <p className="mt-2 leading-6 text-muted-foreground">{brief.crewDescription} {brief.communicationsAssumption}</p>
            <h3 className="mt-4 font-medium text-foreground">Pre-positioned equipment</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              {brief.prePositionedEquipment.map(item => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Success and abort criteria</h3>
            <ul className="mt-2 space-y-2 text-muted-foreground">
              {brief.successCriteria.map(item => <li key={item}>Success: {item}</li>)}
              {brief.abortCriteria.map(item => <li key={item}>Abort: {item}</li>)}
            </ul>
            <p className="mt-4 leading-6 text-muted-foreground"><span className="font-medium text-foreground">Model limits:</span> {brief.modelLimits.join(' ')}</p>
          </div>
        </div>
      ) : null}
    </section>
  )
}
