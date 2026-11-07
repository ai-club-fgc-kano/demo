# OUTPOST — Project TODO

> **Purpose:** A free, browser-based junior astronaut training demo in which a learner operates a pre-deployed lunar south-pole surface outpost, makes crew and systems decisions, observes their consequences in an interactive spatial environment, and completes a finite mission.
>
> **Product standard:** This is a demo, not a production mission-control system. The implementation must nevertheless be coherent from briefing through operations, system simulation, incidents, outcomes, and debrief. It must not be a static dashboard with arbitrary numbers, a decorative 3D scene, or a collection of disconnected interactions.

## Product decisions and non-negotiable scope

- [ ] Keep the first complete experience focused on **one lunar south-pole surface mission**. The learner is a surface mission crew member who performs science and EVA operations while helping maintain essential outpost systems. The scenario may include commander-level resource choices, but it is not a long-term lunar-settlement builder.
- [ ] Describe the scenario as a **fictional educational training scenario inspired by lunar surface exploration**. Do not imply that the simulated habitat, power architecture, timelines, crew procedures, or mission profile are exact NASA/Artemis flight hardware or an official NASA training system.
- [ ] Make the mission finite and completable. Define its duration, crew, environment, systems, available equipment, objectives, and end conditions in a mission definition rather than scattering them across UI components and engine conditionals.
- [ ] Keep the demo free to enter and immediately playable. Do not add authentication, accounts, classroom administration, subscriptions, a server database, multiplayer, or a backend platform as part of this work.
- [ ] Treat the simulation as the source of truth. Every resource reading, component condition, alert, scene state, mission objective, and debrief result must derive from the same mission state and documented transition rules.
- [ ] Make the main simulation experience a **spatial operations environment**: a polished 3D lunar surface scene where the learner can inspect and operate mission assets. Provide a functionally equivalent 2D/isometric operations-map fallback for small screens, reduced-capability devices, and WebGL failures. The 3D view must never be merely decorative.
- [ ] Keep NASA data and imagery as grounded educational/contextual material. The core mission must remain playable when an external NASA endpoint is slow, unavailable, or rate-limited. Clearly distinguish live/retrieved facts, cached reference material, and scenario assumptions.
- [ ] Preserve useful existing behavior and visual work unless an explicit TODO calls for changing it. Refactor with intent; do not replace functioning features with placeholders or a smaller generic demo.

## Current repository baseline

The following observations were made against the repository's `main` branch during this review. Re-check the live tree before implementation because the repository can change.

- [ ] `app/page.tsx` currently renders `MissionTrainer` directly. The landing state and active simulator are both switched inside `components/MissionTrainer.tsx`; there are no separate landing and mission routes yet.
- [ ] `components/MissionTrainer.tsx` currently combines the landing page, mission shell, resource cards, operation selection, event panel, score visualization, objective list, theme controls, and several presentational components in one client component file.
- [ ] `lib/simulation/engine.ts` currently contains state types, starting state, module catalog, a fixed array of three incidents, action availability, action validation, event resolution, and the full cycle transition in one file.
- [ ] The current engine uses `Math.random()` directly. Incident selection is not seeded, is not reproducible, and is not meaningfully conditioned on the operational state. The current condition (`Math.random() < 0.62 || cycle % 3 === 0`) can make incidents feel arbitrary or frequent.
- [ ] Resource values use mixed display units (`%`, litres, days, kits), but the engine largely clamps them through the same 0–100 range and applies simplified arithmetic. A displayed unit does not currently imply a physically consistent model.
- [ ] The current power model uses simple generation/demand constants. It does not model a configured energy interval, generation availability, battery capacity in a physical unit, load priorities, or a traceable energy balance.
- [ ] The current mission score averages `safety`, `integrity`, `readiness`, and `efficiency`, then describes the result as an “overall success probability”. That value is not a calibrated probability and should not be labelled as one.
- [ ] The current engine advances a cycle, updates modules/resources, optionally creates an incident, and can end the mission at a hard-coded cycle threshold. The transition order, incident lifecycle, objective validation, and debrief contract need to become explicit and testable.
- [ ] The current scenario has four buildable modules (`solar`, `battery`, `recycler`, `shielding`), a small set of generic operations, and three fixed incidents. These are useful starting concepts, not a complete mission model.
- [ ] The UI shows resource cards, four mission metrics, objectives, a mission score graphic, operation buttons, and event choices. It does not currently provide a spatial operations view or a complete visible mission log/debrief experience.
- [ ] `public/lunar-surface.png` is currently used as a static, grayscale landing-page image. The repository does not currently include a Three.js/React Three Fiber dependency or an interactive 3D scene.
- [ ] The repository currently has no visible test suite, lint/typecheck/test scripts, or GitHub Actions workflow. `next.config.mjs` sets `typescript.ignoreBuildErrors: true`, which must not be used to hide type errors.
- [ ] The current theme is toggled through a root `.dark` class and `localStorage`. The initial theme is dark in component state, then local storage is read after mount; audit this for first-paint mismatch and safe storage access.
- [ ] The current package name is `my-project`; metadata still identifies `v0.app`; Geist CSS variables are referenced in global CSS but the current root layout does not visibly configure a Geist font provider.
- [ ] The visible tree is small (31 entries at review time) and contains no root `README.md`, `TODO.md`, or `AGENTS.md`. Avoid assuming a larger architecture already exists.

---

# Phase 0 — Baseline, safety, and implementation discipline

**Goal:** Establish what is actually in the repository before changing it, preserve the working baseline, and make subsequent work verifiable.

- [x] Record the starting branch, HEAD SHA, working-tree status, and current deployment URL before modifying files. Do not overwrite, reset, clean, or silently discard uncommitted work.
- [x] Run the existing install/build flow using the repository's declared package manager and lockfile. Record the baseline build output and distinguish pre-existing failures from regressions introduced later.
- [ ] Run the application locally and manually inspect both current states: the landing screen and the active mission screen. Capture screenshots at desktop and narrow-mobile widths before redesigning either screen.
- [ ] Inspect browser console output, hydration warnings, React key warnings, network failures, and runtime exceptions. Fix only issues that are in scope, but record every confirmed finding.
- [x] Trace every exported function and state field in `lib/simulation/engine.ts` to its UI usage before refactoring. Preserve existing working behavior unless its behavior is explicitly replaced by a better specified behavior in this TODO.
- [x] Trace `MissionTrainer` imports, state transitions, selected action behavior, event choice behavior, reset behavior, theme behavior, and the exact point at which the mission becomes terminal.
- [x] Verify the actual runtime and deployment constraints before selecting a rendering stack or loading strategy. Confirm the supported Next.js, React, Tailwind, TypeScript, and pnpm versions from the checked-out lockfile and package manifest.
- [x] Create a small architecture/decision note for the scene renderer (Three.js directly vs. React Three Fiber, or another justified approach). Compare ecosystem fit, bundle cost, mobile performance, developer complexity, and accessibility before adding dependencies.
- [x] Create a clear implementation branch and keep changes scoped to this project. Do not perform drive-by dependency upgrades, unrelated formatting passes, or broad file renames.
- [x] Preserve the current baseline commit and any useful assets. Do not delete the current lunar image, icons, button primitive, or simulation behavior until their replacement has been implemented and checked.

**Exit criteria:** The agent can explain the current application flow, current simulation transition, known defects, and baseline build state before redesigning them.

# Phase 1 — Engineering foundations and maintainable boundaries

**Goal:** Remove structural blockers without prematurely rebuilding the entire app.

- [x] Rename the package from `my-project` to a meaningful project identifier such as `outpost-mission-trainer` (or an agreed name) and update only the package metadata that is actually relevant.
- [x] Remove `typescript.ignoreBuildErrors` from `next.config.mjs`. Type errors must be fixed rather than bypassed.
- [x] Add explicit scripts for `dev`, `build`, `start`, `typecheck`, `lint`, and `test`. Use tools compatible with the existing Next.js/TypeScript setup and ensure the lockfile is updated with any dependency change.
- [x] Add a lint configuration that matches the project's actual framework and TypeScript versions. Avoid introducing conflicting or obsolete ESLint presets.
- [x] Add a test runner appropriate for the codebase and separate fast, deterministic simulation tests from browser/UI tests. Do not add an elaborate end-to-end framework unless the actual demo requires it.
- [x] Configure the font provider in `app/layout.tsx` so the Geist variables used by `app/globals.css` are actually defined, or replace those variables with a deliberately selected installed/system font stack.
- [x] Remove the `generator: 'v0.app'` metadata and replace it with accurate product metadata. Set an accurate page title and description that explain this is an educational lunar surface mission simulator.
- [x] Review installed dependencies and imports. Confirm whether `@vercel/analytics` is actually used; either integrate it deliberately with a privacy-conscious reason or remove it. Do not keep unused packages by accident.
- [x] Add a root `README.md` describing the demo, local setup, scripts, high-level architecture, mission assumptions, and how to add a mission/system/event without putting implementation detail into the README that belongs in code documentation.
- [ ] Define clear boundaries between app routes, reusable UI, mission-specific scene rendering, simulation domain logic, mission scenario definitions, NASA/reference-data adapters, and tests.
- [x] Split `components/MissionTrainer.tsx` by responsibility. At minimum, separate landing-page UI, simulation workspace shell, mission header/navigation, resource/telemetry panels, operation selection, event/alert presentation, cycle timeline, mission log, and debrief.
- [x] Split `lib/simulation/engine.ts` by domain responsibility. Keep a small public engine/orchestrator entry point if useful, but isolate domain types, action validation, resource models, system models, event eligibility/resolution, cycle orchestration, objective evaluation, and outcome calculation.
- [x] Avoid creating one oversized replacement file. Each module must have one coherent reason to change; each React component should own a clear portion of the UI and receive typed inputs rather than reading or mutating unrelated global state.
- [x] Keep mission-specific constants, schedules, available equipment, events, and objective definitions outside generic simulation mechanics. The generic engine must not hard-code the lunar mission's cycle number or specific incident names.
- [x] Add path aliases only where they improve clarity; use consistent import ordering and naming. Do not invent a complex monorepo or plugin architecture for this demo.
- [x] Retain and reuse `components/ui/button.tsx` and `lib/utils.ts` when appropriate. Do not replace the established UI primitive system with custom one-off buttons across the app.

**Suggested target structure (adapt to the actual implementation; do not create empty folders solely to match this illustration):**

```text
app/
  layout.tsx
  globals.css
  page.tsx                         # landing page
  mission/
    [missionId]/
      page.tsx                     # simulation route
components/
  landing/
    LandingPage.tsx
    HeroSection.tsx
    MissionPreview.tsx
    HowItWorks.tsx
  mission/
    MissionWorkspace.tsx
    MissionHeader.tsx
    MissionTimeline.tsx
    MissionBriefing.tsx
    MissionDebrief.tsx
    MissionLog.tsx
  simulation/
    scene/
      OperationsScene.tsx
      SceneFallback.tsx
      SceneControls.tsx
      SceneAsset.tsx
      SceneHotspot.tsx
    panels/
      SystemOverview.tsx
      ResourceTelemetry.tsx
      CrewStatus.tsx
      ObjectivePanel.tsx
      OperationPanel.tsx
      EventPanel.tsx
      ComponentInspector.tsx
  ui/
lib/
  simulation/
    domain/
      types.ts
      units.ts
      thresholds.ts
      validation.ts
    engine/
      create-initial-state.ts
      advance-cycle.ts
      resolve-action.ts
      resolve-event.ts
      evaluate-objectives.ts
      evaluate-outcome.ts
    systems/
      power.ts
      life-support.ts
      thermal.ts
      habitat.ts
      communications.ts
      crew.ts
      mobility.ts
    events/
      eligibility.ts
      selection.ts
      definitions.ts
    random/
      seeded-random.ts
  missions/
    registry.ts
    lunar-south-pole/
      definition.ts
      environment.ts
      schedule.ts
      assets.ts
      actions.ts
      events.ts
      objectives.ts
      educational-notes.ts
  nasa/
    client.ts
    imagery.ts
    reference-data.ts
hooks/
  use-mission.ts
  use-theme.ts
tests/
  simulation/
  components/
```

# Phase 2 — Define a credible mission and simulation contract

**Goal:** Replace arbitrary resource changes with an internally consistent, teachable operating model. The goal is an educational systems simulation, not a flight-certified aerospace model.

## 2.1 Mission definition and scenario assumptions

- [x] Write a mission brief for one fictional pre-deployed lunar south-pole outpost scenario: mission purpose, site context, crew size, mission window, habitat assets, pre-positioned equipment, communications assumptions, available spares, and success/abort criteria.
- [x] Use a two-person surface crew as the initial scenario unless the current product requirements establish a different crew count. Make crew count a mission configuration value, not an engine constant.
- [x] Define an explicit finite training window (the current engine appears to target an eight-cycle completion threshold). Store the duration in the mission definition and make the final cycle logic derive from it.
- [x] Document which systems and assets are assumed to have been delivered before the crew arrives. Do not accidentally turn an early surface expedition into a fully developed lunar settlement.
- [x] Document the model's limits. Use plausible causal relationships and scenario parameters, but do not claim high-fidelity orbital mechanics, exact NASA flight rules, precise biomedical prediction, or exact Artemis hardware replication.
- [x] Separate scenario facts, educational simplifications, and adjustable game parameters. Give every important simulation parameter a unit, a short explanation, and a source or an explicit “scenario assumption” label.
- [x] Make the illumination and environmental conditions configurable for the selected south-pole site. Do not implement simplistic “lunar day/night” behavior or assume that every south-pole location receives continuous sunlight.
- [ ] Define the environment input for each cycle: illumination availability, external thermal condition, dust exposure, radiation forecast/alert level, and operational constraints. Keep these values in the scenario environment rather than sprinkling them through calculation functions.

## 2.2 Typed state and units

- [ ] Replace the current loose state model with a typed mission state that clearly separates resources, subsystem condition, crew condition, environment, assets, objectives, event state, mission time, and mission outcome.
- [ ] Define actual units for every numeric field. Use consistent, labelled units such as kWh for stored energy, kW for power, litres for water, kilograms or crew-days for consumables, hours for crew time, and inventory counts for spare parts. Use percent only for a genuinely normalized condition/health score.
- [ ] Stop treating spare-part inventory, litres of water, crew-days of food, and battery state as interchangeable 0–100 gauges. A value of 42 must mean something precise within its own unit.
- [ ] Define resource capacity, minimum operational reserve, warning threshold, critical threshold, and hard-failure threshold separately. A warning should not be the same thing as an empty tank.
- [ ] Make display formatting unit-aware. Resource bars must calculate against the resource's actual configured capacity, not blindly against 100.
- [ ] Add domain-level helper functions for safe arithmetic, capacity bounds, inventory subtraction, and threshold evaluation. Ensure an invalid operation cannot silently create negative stock, exceed capacities, or produce `NaN`/infinite values.
- [ ] Model consumables, energy stores, equipment condition, and accumulated exposure as different concepts. Do not make every metric rise and fall through the same generic `clamp()` path.
- [ ] Define whether each quantity is instantaneous, per-cycle consumption, accumulated total, rate, or capacity. Document the simulation interval and conversion between rates and cycle totals.
- [ ] Store the random seed and relevant scenario version in the mission state or mission run metadata so a run can be reproduced and its report can identify the conditions used.

## 2.3 Interdependent subsystem models

- [ ] Implement an energy balance that calculates generation, demand, charging, and battery discharge over a configured cycle interval. Record the amount generated, consumed, stored, and unmet; do not use arbitrary constant reserve increments.
- [ ] Model solar generation from configured array capacity, available illumination, array condition, and dust/obstruction derating. Treat these as explicit inputs with documented ranges.
- [ ] Model battery storage with a defined capacity, charge/discharge limits, current stored energy, and critical reserve. Enforce the capacity and prevent the battery from increasing above its real configured maximum.
- [ ] Define load categories and priority: life support, thermal safety, communications, essential habitat loads, science equipment, and discretionary loads. When generation is insufficient, shed lower-priority loads deliberately and report which activities were interrupted.
- [ ] Make equipment that consumes energy affect the energy balance. For example, running the water recovery equipment should use power; installing a module should not magically improve resources without commissioning and operating costs.
- [ ] Model water inventory in litres. Subtract crew consumption, add recovery only when an operational recovery system has feedstock, adequate power, and sufficient equipment health, and enforce realistic configured capacity.
- [ ] Model oxygen inventory/availability independently from water. Define crew consumption and the scenario's oxygen-generation/replenishment assumptions. Ensure any oxygen production mechanism has explicit prerequisites and energy/resource costs.
- [ ] Include carbon-dioxide removal/air revitalization as a distinct life-support function. Filter condition, consumables, power, and maintenance should influence capability; do not represent all atmosphere safety with a single arbitrary “oxygen points” value.
- [ ] Model food as a finite provision with a clear unit (for example, crew-days). Consume according to active crew count and cycle duration; do not restore food through unrelated actions such as conserving electricity.
- [ ] Implement thermal-control behavior with a configured safe operating band, heat load, external conditions, power availability, and equipment health. Report temperature/thermal condition changes in a way the learner can understand.
- [ ] Model habitat integrity and dust contamination as equipment/structure condition rather than an invisible global “integrity” number. Define the relevant affected components (for example seals, radiators, array surfaces, filters, or airlock equipment) and how inspection/maintenance changes them.
- [ ] Model communications as a mission capability where useful: antenna/relay availability, scheduled contact windows, power, and loss-of-link consequences. Keep it small enough for the demo and do not introduce a full orbital network simulator.
- [ ] Model surface mobility/EVA capability through suit readiness, rover or equipment availability if included, available crew time, route hazards, dust exposure, and return-to-habitat constraints.
- [ ] Make the subsystem models exchange state through explicit inputs/outputs. Avoid one system directly mutating unrelated state fields without a documented dependency.
- [ ] Add subsystem status derivation (`nominal`, `watch`, `warning`, `critical`, `offline` or a similarly consistent set) from actual operating thresholds. UI status must be derived, not manually assigned by components.

## 2.4 Crew and operational constraints

- [ ] Model the crew as actual crew members or a clearly defined crew aggregate. If individual members are represented, give them stable IDs and explicit duty/readiness state.
- [ ] Track crew availability, scheduled work time, EVA eligibility, fatigue/readiness, and safety constraints. Do not let the same crew perform unlimited operations in one cycle.
- [ ] Distinguish a normal scheduled work cycle from an emergency response. Define which actions consume crew hours, which require an EVA, and which can be performed from inside the habitat.
- [ ] Ensure EVA prerequisites are validated: suit readiness, available crew time, airlock readiness, power/communications support if required, environmental window, and a safe return path.
- [ ] Track accumulated crew exposure or hazard state only to the level supported by the educational scenario. Do not invent precise medical diagnoses or present fictional values as real clinical guidance.
- [ ] Ensure an unsafe action has an explainable consequence and is not silently allowed because the UI button happened to be visible.

**Exit criteria:** A reviewer can trace a resource or safety change from a specific action/environment input through subsystem calculations to the final displayed reading and event/report text. Units and scenario assumptions are documented.

# Phase 3 — Rebuild the mission engine as a deterministic, end-to-end cycle

**Goal:** Make actions, system evolution, incidents, objectives, and outcomes respond to the same mission state and behave consistently on every run with the same seed.

## 3.1 Action model and validation

- [ ] Replace string-only action handling with a typed action definition containing ID, label, description, category, prerequisites, crew/time cost, resource cost, affected systems/assets, expected effects, risk, and educational explanation.
- [ ] Separate action **availability** from action **validation**. Availability is a UI hint; the engine must revalidate all conditions when an action is submitted.
- [ ] Validate required crew, available time, system state, spare parts, energy, environment window, and asset readiness before accepting an operation.
- [ ] Provide a precise validation result explaining why an operation is unavailable. Do not mutate mission state or consume resources on a rejected action.
- [ ] Implement a deliberate choice/confirmation interaction for high-consequence operations. Clearly show costs, expected benefit, risk, and conditions before the learner commits.
- [ ] Ensure the learner can inspect an asset before operating it. Where diagnosis is necessary, show uncertainty or incomplete telemetry rather than presenting hidden information as known.
- [ ] Keep one primary planned operation per cycle if that remains the scenario's workload model, with separate emergency responses only when the event model explicitly permits them. Do not let UI convenience accidentally bypass crew/time constraints.
- [ ] Model construction/commissioning as a sequence with a real work duration, crew-hour cost, power/material cost, prerequisites, and a final commissioned state. A queued asset must not deliver its full benefit before it is ready.
- [ ] Make repairs consume the correct spare part and crew time, and restore only the component that was repaired. Do not use generic repairs to increase unrelated integrity/safety metrics.

## 3.2 Cycle orchestration

- [ ] Define one documented cycle transition pipeline and implement it in one orchestrator. Suggested order: accept/validate planned operation; apply operation costs and direct results; advance time/environment; execute scheduled maintenance and subsystem calculations; evaluate degradation and thresholds; generate/resolve eligible incidents; evaluate objectives and abort conditions; produce cycle report; advance mission clock.
- [ ] Decide and document exactly when an operation takes effect relative to passive consumption, scheduled maintenance, module commissioning, and incidents. Do not leave ordering implicit in a long function.
- [ ] Make transition operations deterministic and testable. Prefer pure calculation functions returning updated values and log events; isolate side effects (storage, UI effects, external data loading) outside the simulation engine.
- [ ] Prevent double advancement from double clicks, stale callbacks, repeated keyboard events, or a pending incident. Ensure a cycle can only be resolved once.
- [ ] Define what happens when a mission reaches an abort condition during the cycle. A terminal mission should not continue generating ordinary operations or unresolved incidents unless a specific debrief flow requires it.
- [ ] Define the final cycle behavior explicitly. Do not use a hidden hard-coded `cycle >= 8` condition in a generic transition function.
- [ ] Make reset create a genuinely fresh run with a fresh or explicitly selected seed. Keep the reset interaction deliberate so it is not triggered accidentally.
- [ ] If mission progress is persisted, version the stored state and handle invalid/outdated saved runs gracefully. Do not add a database merely to retain a local demo run.

## 3.3 Reproducible events and scenario pacing

- [ ] Replace direct `Math.random()` calls with an injected seeded random-number generator. The same mission definition, initial state, seed, and actions must produce the same simulation result.
- [ ] Separate scheduled events (known work/forecast windows), state-dependent incidents (caused by wear, low reserves, exposure, or prior decisions), and bounded stochastic occurrences. These categories must not be conflated.
- [ ] Give each incident explicit eligibility conditions, severity, affected assets/systems, warning/forecast behavior, cooldown, resolution choices, costs, effects, and follow-on consequences.
- [ ] Make incident probability depend on operational context. A dusty EVA may increase airlock/seal/filter exposure; neglected maintenance may increase equipment-fault likelihood; low reserve may constrain responses. Do not select incidents from a fixed list with no relationship to state.
- [ ] Prevent the same major incident from repeatedly appearing without a plausible recurrence condition and cooldown. Do not guarantee an emergency every cycle.
- [ ] Limit the number of major incidents per cycle and avoid stacking unrelated crises simply to make the simulation feel active.
- [ ] Give the crew useful lead time for forecastable hazards such as radiation alerts. A warning should be actionable before a severe exposure state when the scenario permits.
- [ ] Provide multiple viable event responses with distinct trade-offs. Avoid choices where one option is obviously correct every time or where labels imply an outcome that the engine does not actually implement.
- [ ] Make each event response mutate the relevant subsystem and asset state, not merely add/subtract generic safety points. Log the causal chain.
- [ ] Add event explanation text that tells the learner what changed, why it matters, and what to monitor next cycle.

## 3.4 Objectives, evaluation, and debrief

- [ ] Define objectives as structured conditions with IDs, descriptions, progress, completion criteria, failure criteria, and optional prerequisites. Do not identify objectives only by their visible text label.
- [ ] Update objective progress from simulation state and completed operations. Do not mark an objective done solely because a button was clicked if the required mission result did not occur.
- [ ] Add optional/secondary objectives that reward good operations without making them mandatory for basic mission completion.
- [ ] Calculate the final result from explicit outcome dimensions: crew safety, habitat/system reliability, resource stewardship, science completion, and mission readiness. Use a rubric or named outcome bands, not an uncalibrated “success probability”.
- [ ] Define distinct outcomes (for example, mission completed with strong reserves, science completed with degraded reserves, safe mission with missed science, or mission aborted) and explain why the result occurred.
- [ ] Create a structured event/operation log with timestamp/cycle, kind, affected asset/system, before/after values where useful, tone/severity, and an explanation.
- [ ] Generate a complete cycle report that lists actions taken, system changes, resource delta, newly active warnings, event decisions, objective progress, and next-cycle priorities.
- [ ] Generate a final mission debrief with outcome, objective completion, resource state, notable decisions, consequences that persisted, and concise lessons learned.
- [ ] Make the debrief specific to the actual run. Do not write generic victory copy when objectives failed or hide trade-offs behind a single score.
- [ ] Add a replay option that can reuse the same seed for comparison or start a new seed for a different run.

**Exit criteria:** A full mission can be played to a terminal outcome; invalid actions are rejected without mutation; the same seed and actions reproduce the same run; and every displayed consequence is explainable from the engine's log/report.

# Phase 4 — Build the interactive 3D / spatial operations environment

**Goal:** Make the physical mission site the central interface for understanding and operating the outpost. The visual scene must communicate actual mission state and accept meaningful interactions.

## 4.1 Scene direction and visual quality

- [ ] Design a coherent lunar south-pole site scene before coding the renderer. Include a readable composition, clear scale relationships, believable terrain, and a restrained visual hierarchy; do not assemble random primitives into a cheap-looking game board.
- [ ] Choose a deliberate visual direction: realistic/stylized scientific visualization with carefully modelled assets, calibrated materials, controlled lighting, useful shadows, subtle dust/terrain detail, and restrained UI overlays. Avoid gratuitous neon, excessive glow, cartoonish proportions, generic sci-fi HUD clutter, and noisy gradients.
- [ ] Define the scene's essential assets from the mission definition: habitat/pressurized module, airlock, solar array, battery/power unit, communications antenna, science worksite/instrument, rover or mobility asset if included, landing/transfer asset if required, and traversable surface area.
- [ ] Use a consistent asset scale and a clearly understandable camera angle. The scene should communicate where the crew, habitat, science site, power equipment, and hazards are relative to one another.
- [ ] Build or source assets with compatible licenses and appropriate quality. Prefer cohesive custom/simple geometry with good materials over an inconsistent pack of low-quality assets. Record asset provenance and attribution.
- [ ] Use the existing lunar surface image only where it materially helps; do not rely on a flat background photograph to fake an interactive scene.
- [ ] Add meaningful environmental context such as low-angle sunlight, terrain shadows, horizon, regolith variation, and a subtle lighting change when illumination changes. Treat these as scenario-driven visualization, not a full celestial mechanics engine.
- [ ] Keep text, labels, charts, controls, and complex interaction panels in normal accessible HTML UI layered around/over the scene. Do not put all interface text inside a WebGL canvas.

## 4.2 Scene interaction model

- [ ] Define a scene asset registry that maps each rendered object/hotspot to a stable mission asset ID. Do not encode simulation rules directly inside Three.js mesh event handlers.
- [ ] Make important assets selectable by click/tap and keyboard-accessible through a matching asset list or inspector. Selecting an asset must open a focused inspector with its condition, current status, telemetry, available actions, and relevant training note.
- [ ] Add clear hover/focus/selected states. Use a restrained outline, marker, elevation, or label treatment so the user can identify interactive objects without a constant wall of hotspots.
- [ ] Connect scene actions to the same typed action dispatch used by the operation panel. The scene and the HTML operation list must never have separate simulation logic.
- [ ] Connect the visual state of every major asset to engine state: array dust/health/illumination, battery charge/availability, habitat warnings, airlock condition, instrument/rover availability, and active repair state where represented.
- [ ] When a subsystem is warning or critical, show a local spatial cue on its asset plus a concise global alert. Never rely on color alone; include an icon/label/description and a non-visual alert list.
- [ ] Represent real simulated events spatially when it improves comprehension: a dusty airlock area, a solar array fault, a radiation shelter procedure, or a science site hazard. The visual cue must reflect the actual incident and must clear/change when the engine resolves it.
- [ ] Show crew movement or EVA route only when movement is part of the operation model. If a crew marker animates, it must represent a real operation in progress/result, not random background animation.
- [ ] Add inspectable points of interest, but do not make decorative objects appear actionable. Every hotspot must have a real inspection or operation use.
- [ ] Provide a clear scene legend and a reset-camera control. Make camera state independent from mission simulation state.

## 4.3 Camera, responsiveness, and resilience

- [ ] Support intuitive orbit/rotate, pan, and zoom controls with sensible limits. Prevent the camera from clipping through the terrain or zooming so far away that the outpost becomes unreadable.
- [ ] Make pointer controls, touch gestures, and keyboard camera controls predictable. Avoid stealing page scroll gestures on mobile.
- [ ] Provide a default camera framing that places the core habitat and operational assets in view on first entry. Preserve a stable framing when the user changes selection.
- [ ] Provide a compact-screen layout that switches to a simplified 2D/isometric operations map or a list-first interface instead of shrinking the 3D canvas until it becomes unusable.
- [ ] Add a renderer failure boundary and graceful fallback if WebGL is unavailable, initialization fails, a device loses its context, or the browser cannot allocate enough GPU resources.
- [ ] Lazy-load the 3D renderer so the landing page does not pay its full bundle/initialization cost. Avoid importing a large scene into the initial route bundle.
- [ ] Add a practical quality profile (for example high/standard/low or auto) that adjusts shadows, pixel ratio, effects, model detail, and render frequency without changing simulation logic.
- [ ] Respect `prefers-reduced-motion`; provide a static scene mode and avoid unnecessary camera movement, flashing, or attention-grabbing transitions.
- [ ] Dispose geometries, materials, textures, event listeners, and renderer resources correctly when the scene unmounts or reloads. Watch for memory leaks when replaying missions.
- [ ] Avoid rendering every animation frame when no animation or scene state change requires it, where the selected rendering stack supports demand-based rendering.
- [ ] Set performance budgets and test on a mid-range mobile device, not only a desktop development machine. The 3D view must not make the entire demo unusable on mobile.

## 4.4 Scene/engine synchronization

- [ ] Pass an immutable, display-ready mission snapshot into the scene. Do not let the renderer independently calculate resource consumption, random incidents, or mission outcomes.
- [ ] Keep scene presentation selectors (e.g. asset status, visual intensity, label text) outside the simulation engine. Keep all actual mission rules inside the domain/engine layer.
- [ ] Use stable IDs and typed event/action payloads across the scene, selected asset inspector, operation panel, and engine.
- [ ] Animate only the transition between two known engine states. Do not let visual animation invent a different state from the authoritative mission snapshot.
- [ ] Add integration tests confirming that selecting and operating an asset through the scene causes the same validated engine transition as using the operation panel.

**Exit criteria:** A learner can identify, inspect, and operate core mission assets in the spatial view; visible damage/status changes follow simulation state; and the complete mission remains usable without WebGL.

# Phase 5 — Rebuild the simulation workspace as a polished mission-control experience

**Goal:** Make the operational interface understandable, information-dense without being overwhelming, and visibly connected to the simulation.

- [ ] Separate the simulation route from the marketing/landing route. Keep `/` focused on introducing the experience and use a dedicated mission route such as `/mission/lunar-south-pole` for active operations.
- [ ] Create a clear mission header showing mission name, site, cycle/time, crew status, overall mission state, and a small number of urgent alerts. Avoid making the header a row of decorative statistics.
- [ ] Establish a strong spatial workspace layout: central operations scene, a focused asset/operation inspector, and a telemetry/mission-status area. Keep the most important controls visible without making the 3D scene a tiny card.
- [ ] Design desktop and mobile layouts independently. On mobile, use a deliberate panel/sheet/tab arrangement with one clear primary action at a time; do not squeeze desktop columns into a narrow viewport.
- [ ] Add a compact mission overview that lets learners inspect energy, life support, thermal control, communications, habitat, crew, and science systems without opening every panel.
- [ ] Show critical resource telemetry with actual numeric values, units, capacity, thresholds, recent delta, and estimated endurance only when the endurance calculation is meaningful. Label estimates as estimates and show their assumptions.
- [ ] Replace the current generic resource cards with a hierarchy that distinguishes stored consumables, energy rates/stores, spare-part inventory, equipment condition, and crew operational status.
- [ ] Show subsystem state with clear levels and explanations: nominal, watch, warning, critical, offline/recovering. Use color as a secondary cue, not the sole signal.
- [ ] Show why a reading is changing. Each key metric should be inspectable for its last-cycle delta, active contributing factors, and the next risk threshold.
- [ ] Display a compact operational timeline with the current cycle emphasized and previous/next context. If retaining a carousel, make the current cycle central, keep adjacent cycles subtly visible, and prevent selecting a previous cycle from mutating/replaying mission state.
- [ ] Provide a current-cycle briefing before an operation: priorities, constraints, forecast/environment, current warnings, available crew time, and required decisions.
- [ ] Present actions as deliberate operations, grouped by context (habitat systems, power, life support, EVA/science, maintenance). Show prerequisites, costs, time, risks, and expected effects before commit.
- [ ] Make unavailable actions discoverable but clearly disabled with a specific reason. Do not silently omit all options and leave the learner guessing.
- [ ] Provide an explicit operation review/confirmation for high-cost or high-risk actions. Avoid an accidental click consuming critical inventory.
- [ ] Implement a clear pending-event state that blocks conflicting cycle advancement and makes the event's severity, deadline, affected asset, evidence, options, and trade-offs understandable.
- [ ] Add a cycle-resolution sequence with a calm progress transition: operation accepted, systems updated, event resolved, report presented. Avoid fake real-time counters that do not correspond to engine work.
- [ ] Show a detailed cycle report after resolution and a persistent mission log that can be opened without losing the current context.
- [ ] Replace the current score chart's inferred points with a real history of recorded measurements/outcome dimensions. Only show a trend if it is built from actual stored cycle snapshots.
- [ ] Remove the “success probability” wording unless a validated probability model is genuinely implemented. Prefer mission condition, operational readiness, and explicit outcome indicators.
- [ ] Add helpful empty, loading, error, unavailable-action, pending-event, terminal, and reset-confirmation states. They must look designed, not like incidental leftovers.
- [ ] Make the end-of-mission screen a real debrief, not a generic success/error alert. Show outcome, objectives, key decisions, resource state, and learning summary.
- [ ] Keep the existing light/dark theme capability. Refine both palettes independently for scene legibility, contrast, charts, panels, borders, and status semantics.
- [ ] Persist theme safely and avoid an avoidable light/dark flash. Guard browser storage access and provide a valid default when storage is unavailable.
- [ ] Add keyboard navigation, visible focus, semantic headings/regions, accessible labels, and live announcement for urgent state changes. Verify every scene action also has a keyboard-accessible equivalent.
- [ ] Add responsive typography, compact telemetry formatting, safe overflow behavior, and touch targets that remain usable on small phones.

# Phase 6 — Redesign the landing page and first-run onboarding

**Goal:** Make the first page communicate the product clearly, establish credibility, and move the learner into a real mission without a wall of copy.

- [ ] Replace the current minimal hero-only landing layout with a complete but focused product landing page. Maintain a clear hierarchy and avoid adding sections just to make the page longer.
- [ ] Design a strong hero with a specific headline, concise explanation, primary “Start mission” action, and a visual preview that truthfully represents the actual simulator. Avoid generic phrases that could describe any space-themed game.
- [ ] Use a high-quality still or a lightweight preview of the real spatial operations environment. Do not show a fake UI screenshot or 3D preview that looks materially different from the actual experience.
- [ ] Add a concise “What you will do” section that explains the learner's role: operate habitat systems, manage energy and life support, inspect assets, make surface-operation decisions, and complete science objectives.
- [ ] Add a “How a mission works” section with a small number of steps: briefing, inspect, choose an operation, resolve the cycle, review consequences, and debrief.
- [ ] Add a mission preview with grounded information: lunar south-pole surface setting, configured crew, mission length, major systems, and mission objectives. Use actual mission configuration data rather than duplicated hard-coded copy.
- [ ] Add a systems preview so the learner understands the interdependence of power, life support, thermal control, habitat condition, crew, and science.
- [ ] Explain that decisions persist across cycles. Show one short example of cause and effect (for example, array dust reduces power generation, which can constrain water recovery and science operations) without claiming the simulator models more detail than it does.
- [ ] Add a short educational disclaimer explaining that the scenario is fictional and simplified for learning, not an official NASA training tool or a flight-operations reference.
- [ ] Add NASA/source attribution where NASA assets or data are used. Do not imply official partnership, endorsement, or certification unless there is an explicit basis for that claim.
- [ ] Keep the primary CTA visible and functional on desktop and mobile. It should launch the actual mission briefing, not a non-functional placeholder or a demo-only alert.
- [ ] Consider a short pre-mission briefing/onboarding step that explains controls and mission assumptions before the first operational cycle. Keep it skippable and short.
- [ ] Add a “Resume mission” action only if a saved run really exists and has been validated. Do not display a resume CTA when the app has no restorable mission state.
- [ ] Add a compact footer with project identity, educational disclaimer, data/asset acknowledgements, and links that actually exist. Avoid invented social links or fake partner logos.
- [ ] Remove generic v0/placeholder branding and inspect all visible copy for product consistency. Use one name consistently across browser metadata, landing, simulator, and debrief.
- [ ] Refine the hero image/scene crop and colors. Do not apply grayscale merely as a styling shortcut if it reduces the visual impact or clarity of the lunar setting.
- [ ] Ensure landing performance is excellent: defer the 3D runtime, optimize images, avoid loading the entire mission simulator before the learner starts, and prevent layout shift.
- [ ] Test that the landing page still communicates the purpose of the project when JavaScript or WebGL is unavailable; the main CTA should fail gracefully with a clear explanation if the simulator cannot initialize.

# Phase 7 — Educational content and NASA reference integration

**Goal:** Make the demo genuinely educational and evidence-aware without making a remote API a runtime dependency for mission progression.

- [ ] Add contextual explanations for major systems and operations. Explain what the system does, what the current reading means, why the operation is available, and what trade-off a decision introduces.
- [ ] Tie learning notes to mission state. A note about the solar array should appear when the learner inspects or operates the array, rather than forcing the learner into a disconnected encyclopedia.
- [ ] Add a small Space Academy / mission handbook area only if it is integrated into the active mission flow. Keep it focused on concepts needed to complete the current mission; do not build an unrelated course platform.
- [ ] Add concise explainers for lunar south-pole illumination/terrain, solar power and energy storage, life support and water recovery, thermal control, radiation alerts/shelter decisions, lunar dust, EVA preparation, and surface science.
- [ ] Distinguish known scientific/operational facts from simplified scenario rules. When a model is simplified, say so at the point where the learner could otherwise misunderstand it.
- [ ] Review every numerical mission parameter against a credible source or mark it as a fictional scenario assumption. Do not invent NASA system capacities, consumable rates, exposure limits, or equipment specifications and present them as official values.
- [ ] Add a NASA reference-data adapter only for datasets that materially improve the selected scenario (for example, NASA lunar imagery/metadata or carefully selected lunar site/environment reference data). Keep integration narrow and documented.
- [ ] Add a NASA imagery/reference-data service that handles request failures, timeouts, missing metadata, and caching. Do not call a third-party endpoint from the core transition engine.
- [ ] Keep a curated local fallback for essential mission briefing/educational content so the simulator works if an API is offline or rate-limited.
- [ ] Display source title, provider, source URL, retrieval date where relevant, and any transformations made to the data. Do not expose an API key in client-side code.
- [ ] Keep real data and simulation data separate. A real NASA image or environmental reference may inform the scenario; it must not silently become a precise real-time astronaut hazard forecast.
- [ ] Avoid displaying live space-weather claims unless the selected data source, timestamp, interpretation, and limitations are clearly represented. A historical or contextual feed must not be labelled as a current forecast.
- [ ] Make the mission registry extensible enough to add another scenario later, but do not implement a second Mars or lunar mission until the initial mission is complete, tested, and polished.

# Phase 8 — Quality, accessibility, performance, and robustness

**Goal:** Make the demo reliable enough to present and use, even though it is not a production service.

## Simulation tests

- [ ] Test initial state validity: resources are within capacity, starting assets are in a defined state, mission status is active, objectives are initialized, and the seed is recorded.
- [ ] Test that every action's prerequisites and costs are enforced by the engine, not only by disabled UI controls.
- [ ] Test that invalid operations leave resource inventory, cycle count, objectives, assets, and logs unchanged apart from an explicit validation result if the design records rejected attempts.
- [ ] Test a low-generation cycle: generation deficit draws from storage, lower-priority loads are shed in the defined order, and critical life-support loads are protected until the configured failure threshold.
- [ ] Test depleted battery behavior and verify that a battery upgrade changes actual capacity/charge behavior rather than only changing a display maximum.
- [ ] Test that a dusty/degraded solar array reduces generation, array maintenance restores generation within configured limits, and the scene reflects the resulting condition.
- [ ] Test water recovery limits: no recovery without sufficient feedstock, power, working equipment, and required consumables; repair/maintenance restores only the intended capability.
- [ ] Test oxygen/CO2/life-support behavior under normal, low-power, degraded-filter, and repaired conditions.
- [ ] Test thermal-control behavior when power is constrained and when environment conditions change.
- [ ] Test food and crew workload consumption against the configured crew count and cycle duration.
- [ ] Test that EVA is blocked when suit, crew, route, environmental, or return constraints are not satisfied.
- [ ] Test that event eligibility changes with equipment condition, exposure, reserves, and previous choices; verify cooldown and no repeated major incident without a valid recurrence condition.
- [ ] Test that forecastable hazards provide an actionable warning window where configured.
- [ ] Test that the same seed plus the same sequence of actions yields the same sequence of incidents, resource deltas, objectives, and final result.
- [ ] Test that different seeds can produce valid variation without producing impossible states or unfair unavoidable failure.
- [ ] Test that objective progress derives from actual state and that optional objectives do not prevent the primary mission from resolving.
- [ ] Test successful completion, partial science completion, safe completion with degraded reserves, and abort outcomes.
- [ ] Test no double transition on rapid repeated submissions and no ordinary operation while an event is unresolved or the mission is terminal.
- [ ] Test reset and replay behavior, including whether the seed is retained or regenerated according to the chosen UI.

## UI and scene tests

- [ ] Test landing-to-briefing-to-active-mission-to-cycle-report-to-debrief navigation end to end.
- [ ] Test all operation choices through both the HTML action panel and 3D asset interaction. Confirm they produce the same engine action and validation result.
- [ ] Test scene state after array degradation/repair, battery changes, life-support warnings, active EVA, radiation shelter, and terminal mission state.
- [ ] Test WebGL unavailable, scene initialization error, context loss, low-memory fallback, and mobile fallback.
- [ ] Test light and dark themes on landing, simulation, event, report, and debrief surfaces.
- [ ] Test narrow mobile, standard mobile, tablet, laptop, and wide desktop layouts. Check that the main scene and primary action remain understandable.
- [ ] Test keyboard-only navigation, visible focus, screen-reader labels, status announcements, dialogs/sheets, and reduced-motion preferences.
- [ ] Test that charts, scene markers, and alerts communicate meaning without depending only on color.
- [ ] Test image loading, local storage unavailable/blocked, browser refresh, invalid persisted state, and reset behavior.
- [ ] Test no hydration warnings, console errors, missing React keys, stale state updates, or unhandled rejected promises.

## Build and performance

- [ ] Make `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build` pass. Do not weaken compiler/linter rules to make a failing implementation appear green.
- [ ] Add a lightweight GitHub Actions workflow to run typecheck, lint, tests, and production build for pull requests and pushes to the primary branch.
- [ ] Measure initial landing-route JS and simulator-route JS separately. Ensure the 3D dependency is lazy-loaded and does not inflate the landing route unnecessarily.
- [ ] Profile scene frame time and memory on a representative desktop and a mid-range Android phone. Set a realistic performance target before adding expensive post-processing.
- [ ] Optimize textures, geometry, image formats, shadow maps, draw calls, render pixel ratio, and scene update frequency based on profiling rather than guesswork.
- [ ] Avoid large in-memory state snapshots or duplicated scene assets on every cycle. Keep history useful but bounded or compact for the finite mission.
- [ ] Verify the production deployment's environment variables, route behavior, asset paths, and error behavior. Do not treat a successful local dev server as release verification.

# Phase 9 — Demo presentation and final acceptance

**Goal:** Deliver a coherent demonstration that can be understood and completed by a first-time user without a developer narrating every control.

- [ ] Create a clean first-run experience with a concise mission briefing, simple controls explanation, and an obvious transition into the live operations environment.
- [ ] Prepare one seeded “guided run” that demonstrates a normal operational cycle, a meaningful system trade-off, a state-dependent incident, a visible spatial change, and a debrief. Keep it reproducible for a live presentation.
- [ ] Ensure a learner can also start a different seed/run and make meaningful choices rather than being forced through the exact same scripted answer sequence.
- [ ] Verify that at least one decision has a persistent consequence across multiple later cycles and that the UI makes the cause/effect visible.
- [ ] Verify that the 3D scene is more than a backdrop: a user can inspect assets, see state changes, and initiate real operations from it.
- [ ] Verify that the mission can reach more than one meaningful outcome and that those outcomes are based on the actual simulated state.
- [ ] Verify that the mission remains completable without a remote NASA service and with the 2D fallback active.
- [ ] Verify the UI contains no misleading live-data labels, false “NASA official” implication, fake success probabilities, placeholder links, or dead controls.
- [ ] Confirm the landing page explains the demo in under a minute and the active mission explains what the learner should do next without requiring external documentation.
- [ ] Update `README.md` with final setup and presentation instructions. Keep technical deep dives in focused docs rather than expanding the README indefinitely.
- [ ] Review the full TODO and mark an item complete only when its behavior exists, has been tested at the appropriate level, and is not merely represented by a visual placeholder.
- [ ] Create a final demo checklist with a clean install, production build, browser smoke test, mobile smoke test, seeded run, alternate run, and debrief verification.

---

## Definition of done

The demo is ready for presentation when all of the following are true:

- [ ] A new user can enter from the landing page, understand the fictional training scenario, start the briefing, and reach the active simulation without signing in.
- [ ] The spatial environment is polished, interactive, and connected to authoritative mission state. The app still works through an accessible fallback when 3D is unavailable.
- [ ] A finite lunar surface mission can be completed from beginning to end. Operations consume resources/time, subsystem models interact, incidents depend on context, and decisions affect later cycles.
- [ ] All numeric values have clear units and coherent capacities/rates. Scenario assumptions and educational simplifications are documented.
- [ ] Event choices, cycle reports, mission objectives, and final outcomes reflect actual engine results.
- [ ] A seeded run is reproducible and at least two materially different mission outcomes are possible.
- [ ] Landing and simulation pages are polished in both themes and on desktop/mobile.
- [ ] Typecheck, lint, tests, and production build pass; no known critical console/runtime errors remain.
- [ ] The project remains appropriately scoped as a demo: no unnecessary authentication, database, classroom platform, multiplayer layer, or unrelated product expansion.
