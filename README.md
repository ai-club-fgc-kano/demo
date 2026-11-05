# OUTPOST — Lunar South Pole Mission Trainer

A free, browser-based educational mission simulation. You join a fictional two-person crew at a
pre-deployed lunar south-pole outpost, plan one primary operation per cycle, and live with the
consequences as power, life support, habitat condition, crew readiness, and science compete for
attention.

This is a training demo, not a flight-operations tool. The scenario is inspired by lunar surface
exploration but is not an official NASA trainer and does not reproduce Artemis hardware or
procedures.

## Current status

The project is at **Phase 1 (engineering foundations)** of [TODO.md](TODO.md):

- The landing page and mission workspace are split into focused components.
- The simulation is split into domain types, subsystem models, event selection, validation, and
  cycle orchestration.
- Typecheck, lint, and deterministic simulation tests are wired up and run in the build gates.
- The simulation model is still the original simplified one: resources are 0–100 reserve points,
  incidents are selected randomly without state eligibility, and there is no 3D scene yet.

The interactive 3D operations environment, unit-aware subsystem models, debrief, and seeded runs
are tracked in [TODO.md](TODO.md) and are **not** implemented yet. Nothing in the UI claims
otherwise.

## Getting started

Requires Node.js 20.19+ and pnpm (the repository pins `pnpm@12.3.4` via `packageManager`).

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Scripts:

| Script            | Purpose                                              |
| ----------------- | ---------------------------------------------------- |
| `pnpm dev`        | Next.js development server                           |
| `pnpm build`      | Production build (also runs TypeScript validation)   |
| `pnpm start`      | Serve the production build                          |
| `pnpm typecheck`  | `tsc --noEmit`                                       |
| `pnpm lint`       | ESLint flat config (`eslint-config-next`)            |
| `pnpm test`       | Deterministic simulation tests (Vitest, Node)        |
| `pnpm test:watch` | Vitest in watch mode                                 |

## Architecture

```text
app/
  layout.tsx                     # fonts, metadata, global styles
  page.tsx                       # entry route -> MissionTrainer
components/
  MissionTrainer.tsx             # composition root: theme + mission state wiring
  landing/                       # landing page
  mission/                       # mission workspace and its panels
  layout/                        # shared brand lockup
  ui/                            # reusable primitives (button, icon button)
hooks/
  use-mission.ts                 # reducer wiring for the simulation engine
  use-theme.ts                   # guarded, lint-clean theme store
lib/
  simulation/
    domain/                      # mission-agnostic log/status types, resource arithmetic
    systems/                     # power, life support, habitat, crew models
    events/                      # incident selection
    engine/                      # validation, operations, cycle orchestration, public API
  missions/
    lunar-south-pole/            # mission definition, modules, actions, events, telemetry
    registry.ts                  # mission lookup so the engine never hard-codes one scenario
tests/simulation/                # engine tests (no DOM)
docs/architecture.md             # baseline record, boundaries, renderer decision
```

The engine is the single source of truth. UI components receive mission state and dispatch typed
actions; they do not calculate resources, choose incidents, or decide outcomes.

## Simulation model (current, simplified)

One cycle resolves in a documented order:

1. Validate the submitted operation. A rejected operation logs a reason and changes nothing.
2. Apply the operation's costs and direct effects.
3. Advance the clock and commission queued modules on their configured delay.
4. Run passive power, life-support, habitat, and crew balances.
5. Evaluate state-derived objectives.
6. Select an incident.
7. Evaluate terminal conditions and file the cycle report.
8. Record a condition snapshot for the condition chart.

Known simplifications (each is tracked in TODO.md):

- Every stock is stored as a 0–100 reserve index. Litres, kits, days, and percent are display labels,
  not yet independent physical quantities.
- Power is a fixed generation/demand delta per cycle with no interval, battery limits, or load
  shedding.
- Incident selection uses `Math.random()` with a fixed chance and no cooldowns or state eligibility,
  so runs are not reproducible yet.
- `evaluateOutcome` uses simple thresholds and the mission's configured duration.
- The mission has no debrief, log view, or replay flow yet.

The mission window, crew size, starting resources, objectives, and incidents are defined in
`lib/missions/lunar-south-pole/definition.ts` and its sibling modules, not in the engine.

## Adding content

- **A system model:** add a module under `lib/simulation/systems/` that derives its delta from
  explicit inputs and returns values rather than mutating unrelated state. Wire it into
  `advanceCycle`'s documented order and add a test.
- **A mission:** add a folder under `lib/missions/`, export a `MissionDefinition`, and register it in
  `lib/missions/registry.ts`. The engine reads the duration, objectives, events, and starting state
  from the definition.
- **An incident:** add a `MissionEvent` to the mission's `events.ts` with its choices, effects, and
  causal explanation. Selection rules currently live in `lib/simulation/events/select-incident.ts`.

## Assets and attribution

- `public/lunar-surface.png` is the landing-page image carried over from the original project
  scaffold. Its provenance and license have not been verified; confirm or replace it, and add
  attribution, before any public release.
- No NASA data or imagery is used at this stage. Contextual NASA reference data is planned, and any
  future use must be attributed with source and retrieval date, and must never become a hard
  dependency for the mission to run.

## Educational disclaimer

OUTPOST is a fictional, simplified educational simulation. Its habitat, power architecture, crew
procedures, and timelines are scenario assumptions for teaching systems thinking. They are not
flight hardware specifications, operational procedures, or a NASA-certified training system.
