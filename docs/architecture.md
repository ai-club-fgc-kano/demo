# Architecture and implementation notes

This document records the baseline the project started from, the module boundaries Phase 1
established, and decisions that later phases depend on. [TODO.md](../TODO.md) remains the source of
work; [AGENTS.md](../AGENTS.md) defines the delivery standard.

## 1. Baseline record (Phase 0)

Recorded before any source change:

| Item                  | Value                                                     |
| --------------------- | --------------------------------------------------------- |
| Branch                | `freebuff/92ac628fff9da9915e0ba1a6`                       |
| Starting commit       | `edb63df` (`chores(todo/agent): add TODO.md and AGENTS.md`) |
| Working tree          | Clean                                                     |
| Package manager       | pnpm 12.3.4, `pnpm-lock.yaml` lockfile v9                  |
| Runtime               | Node.js 26.13.0                                           |
| Framework             | Next.js 16.4.3 (Turbopack), React 19.2, Tailwind CSS 4.3   |
| Baseline install      | `pnpm install --frozen-lockfile` — 344 packages, succeeded |
| Baseline build        | `next build` succeeded, **but skipped type validation** because `next.config.mjs` set `typescript.ignoreBuildErrors: true` |
| Baseline tests/lint   | None present                                               |
| Baseline CI           | None present                                              |
| Deployment URL        | Not recorded for this workspace; no preview was deployed    |

Pre-change state of the application:

- `app/page.tsx` rendered `components/MissionTrainer.tsx`, which contained the landing page, mission
  shell, resource cards, operation selection, incident panel, condition chart, objectives, theme
  toggle, and every presentational subcomponent in one client file.
- `lib/simulation/engine.ts` contained state and ID types, the starting state, the module catalog,
  three incident definitions, availability, validation, event resolution, the passive balance,
  terminal conditions, and a hard-coded eight-cycle threshold.
- Incident selection called `Math.random()` directly, so runs were not reproducible.
- The chart labelled an average of four condition indices as an "overall success probability" and
  drew its line from log severities rather than recorded measurements.
- `components/ui/button.tsx` existed but was unused; the UI used one-off raw buttons.
- `@vercel/analytics` was installed but never imported.
- Geist CSS variables were referenced by `app/globals.css` without any font provider defining them.
- Metadata still carried `generator: 'v0.app'`.

Not captured: pre-change screenshots at desktop and narrow-mobile widths. The first visual
verification happened after the Phase 1 refactor, so no before/after pixel comparison exists.

## 2. Current data flow

```text
app/page.tsx
  └─ MissionTrainer (client)
       ├─ useTheme            → external theme store, guarded localStorage, .dark class
       ├─ useMission          → useReducer over the engine's public API
       └─ LandingPage | MissionWorkspace
             ├─ MissionHeader        (cycle, theme, reset)
             ├─ MissionConditionChart(recorded condition history)
             ├─ ResourceTelemetry    (mission telemetry definitions + endurance estimate)
             ├─ OperationPanel       (availability hints, selection, hint, guidance, advance)
             │    └─ EventPanel      (pending incident choices)
             └─ MissionStatusPanel   (safety/integrity/readiness/science, objectives)
```

Cycle transition (authoritative, in `lib/simulation/engine/advance-cycle.ts`):

1. Clone the input state. If the mission is terminal or an incident is pending, return the clone.
2. Validate the submitted action; on rejection, log `Operation unavailable` and return without
   advancing.
3. Apply costs and direct effects (`apply-operation.ts`).
4. Increment the cycle and commission queued modules (`readyCycle <= cycle`).
5. Run passive balances through the subsystem modules (power → life support → habitat → crew).
6. Evaluate state-derived objectives (`evaluate-objectives.ts`).
7. Select an incident (`events/select-incident.ts`).
8. Record the condition snapshot.
9. Evaluate terminal conditions (`evaluate-outcome.ts`) and file the cycle report.

Steps 1–3 and 5–9 are pure calculations over the cloned state; the only side effect is the caller's
reducer swap. Storage and UI effects stay outside the engine.

## 3. Module boundaries established in Phase 1

| Concern                        | Location                                        |
| ------------------------------ | ----------------------------------------------- |
| Mission-agnostic log/status    | `lib/simulation/domain/types.ts`                |
| Resource arithmetic            | `lib/simulation/domain/resources.ts`            |
| Subsystem models               | `lib/simulation/systems/*`                      |
| Incident selection             | `lib/simulation/events/select-incident.ts`      |
| Validation and availability    | `lib/simulation/engine/available-actions.ts`    |
| Operation effects              | `lib/simulation/engine/apply-operation.ts`      |
| Objective derivation           | `lib/simulation/engine/evaluate-objectives.ts`  |
| Outcome derivation             | `lib/simulation/engine/evaluate-outcome.ts`     |
| Cycle orchestration            | `lib/simulation/engine/advance-cycle.ts`        |
| Public engine surface          | `lib/simulation/engine/index.ts`                |
| Scenario state and IDs         | `lib/missions/lunar-south-pole/types.ts`        |
| Scenario data                  | `lib/missions/lunar-south-pole/{definition,modules,actions,events,telemetry}.ts` |
| Scenario lookup                | `lib/missions/registry.ts`                      |
| React state wiring             | `hooks/use-mission.ts`, `hooks/use-theme.ts`    |
| Presentation                   | `components/landing`, `components/mission`      |

Known debt, deliberately deferred:

- The lunar scenario's state shape (flat 0–100 resource fields) is defined in the mission package,
  while `domain/resources.ts` imports its `ResourceKey`/`ResourceDelta` types. Phase 2 replaces the
  model with unit-aware capacities and removes that type dependency from the generic domain layer.
- `select-incident.ts` still consumes `Math.random()` by default. The injectable random source exists
  only so current behaviour is testable; Phase 3 replaces selection with a seeded, eligibility-based
  implementation.
- `MissionState.history` was added so the condition chart plots recorded snapshots instead of
  fabricated points. It is bounded by `slice(-8)` at render time; Phase 3 formalises the mission log.

## 4. Decision: scene renderer (for Phase 4)

Status: **proposed, not implemented.** No 3D dependency is installed yet.

| Option                               | Strengths                                                                 | Costs / risks                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Raw Three.js                         | Smallest possible dependency surface; full control over render loop and disposal | Imperative scene code grows quickly; React lifecycle/disposal must be hand-managed; asset state syncing is manual |
| React Three Fiber (+ drei)           | Declarative meshes driven by the mission snapshot; good React integration; demand-based rendering via `frameloop="demand"`; strong ecosystem for orbit controls, loaders, and helpers | Extra bundle (three + reconciler + helpers); must verify React 19 compatibility of the chosen versions; abstractions can hide disposal mistakes |
| 2D canvas / SVG isometric map only   | Cheapest, most accessible, no WebGL risk                                   | Does not satisfy the spatial-operations requirement for the primary interface  |

Recommendation: **React Three Fiber with a small number of purpose-built geometries**, lazy-loaded in
a client-only chunk, with the SVG isometric operations map as the always-available fallback.

Rationale:

- The scene must reflect authoritative state (array condition, battery state, warnings, active
  incident). Declarative props from a display-ready snapshot make that contract explicit and keep the
  renderer from owning rules.
- The scene is small in object count, so raw Three.js would mostly mean reimplementing reconciler and
  lifecycle handling.
- Accessibility, text, and controls stay in the DOM in both options; neither approach puts labels in
  WebGL.

Before adding the dependency (Phase 4 gate):

1. Verify the chosen `@react-three/fiber` / `drei` versions declare React 19 support and check the
   peer-dependency warnings in the lockfile.
2. Measure the lazy route chunk against a stated budget and confirm the landing route does not load
   the renderer.
3. Confirm `frameloop="demand"` (or explicit invalidation) and reduced-motion behaviour.
4. Verify WebGL-unavailable, context-loss, and low-memory fallbacks with the 2D map.

## 5. Verification for Phase 1

Commands run in this workspace:

- `pnpm typecheck` — passes (0 errors).
- `pnpm lint` — passes, 0 problems, ESLint 10 flat config.
- `pnpm test` — 12/12 deterministic engine tests pass in ~0.3 s.
- `pnpm build` — passes with TypeScript validation enabled (no `ignoreBuildErrors`); `/` is
  prerendered as static content.
- Browser walkthrough in the Cloud browser at 1280×900 and 390×844:
  - landing renders with the Geist font and the mission image;
  - `Start simulation` enters the workspace at Cycle 01;
  - `Inspect habitat` completes the systems-check objective;
  - `Advance cycle` moves to Cycle 02 and presents the "Lunar dust intrusion" incident;
  - choosing "Run a full decontamination" clears the incident and logs the decision;
  - the theme toggle removes `.dark` and applies the light palette;
  - `Reset mission` returns to Cycle 01 without leaving the workspace;
  - no console errors, no page errors, and no horizontal overflow at 390 px width.

Not verified in this phase:

- Pixel-level visual review. Rendered structure, text, and state were inspected through the
  accessibility tree and DOM measurements, not screenshots.
- Production deployment behaviour or hosting configuration.
- 3D/WebGL rendering and fallbacks (not implemented).
- Cross-browser testing beyond the single Cloud browser session.
