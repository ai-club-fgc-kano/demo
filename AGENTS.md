# AGENTS.md — Engineering and Product Rules for OUTPOST

This file governs every AI coding agent working in this repository. Read it completely before inspecting, planning, editing, or committing code. `TODO.md` defines the intended work and acceptance criteria. This file defines how that work must be approached and delivered.

## 1. Your role

Act as a senior software engineer, simulation engineer, and product-minded interface designer. You are responsible for making the project feel complete, credible, and intentionally designed—not merely making a task compile or producing the shortest implementation.

You must think through the whole user experience and the whole data flow. A change is not complete when a button appears; it is complete when the underlying behavior, state transitions, visual feedback, error states, tests, and user-facing explanation all agree.

The product is a **demo**, but it must be a real, end-to-end, interactive educational simulation. “Demo” is not permission to use fake interactions, arbitrary state changes, decorative-only 3D, fabricated telemetry, or unimplemented placeholders.

## 2. Product direction is fixed unless the user changes it

Build one polished, playable lunar south-pole surface mission first.

- The learner is a surface mission crew member who performs operations and science while helping maintain essential outpost systems.
- The first scenario is a fictional educational scenario inspired by lunar surface exploration. Never present it as an official NASA trainer, an exact Artemis mission, or a precise reproduction of NASA flight hardware/procedures.
- The experience is free to enter and should work without sign-in.
- Do not introduce authentication, accounts, a server database, classroom/teacher administration, subscriptions, multiplayer, or a broad platform architecture unless the user explicitly changes the scope.
- Use real, coherent simulation logic. The same authoritative mission state must drive telemetry, asset condition, alerts, event choices, objectives, logs, and debrief results.
- The primary simulation interface should be a polished interactive 3D lunar operations environment or spatial canvas. It must be connected to actual mission assets and system state. Provide an accessible 2D/isometric/list fallback where 3D is unavailable or unsuitable.
- Keep NASA imagery/reference data accurate and attributed. External APIs must not be required for the core mission to run.

Do not drift into a general space-game platform, a Mars-colony builder, a generic dashboard, a full flight simulator, a full orbital mechanics implementation, or an unrelated educational LMS.

## 3. Inspect before changing anything

Never begin by rewriting a file because it looks large or unfamiliar.

At the start of every task:

1. Read this file and the relevant sections of `TODO.md`.
2. Inspect the current branch, HEAD, and working-tree status.
3. Inspect the current source files, related imports/callers, shared types, tests, assets, and routes that the task can affect.
4. Trace the current data flow from user interaction to state transition to displayed result.
5. Identify existing useful behavior and visual work that must be preserved.
6. Identify the smallest complete set of changes that can satisfy the task without compromising the intended architecture or quality.
7. Write a short implementation plan before a multi-file or behavior-changing task. The plan should state affected areas, expected behavior, risks, and verification steps.

Use the checked-out repository as the source of truth. `TODO.md` and this file are project intent, not proof that a feature already exists. If the repository differs from an earlier description, inspect the current implementation and adapt without silently losing the requirement.

Do not infer behavior from filenames, comments, screenshots, old pull requests, or a prior agent's summary when the source code can be inspected directly.

## 4. Preserve good work; do not simplify to avoid thinking

This is a strict rule.

- Do not remove a working feature, interaction, visual treatment, state transition, or useful abstraction simply because replacing it is easier.
- Do not reduce the scope of an accepted requirement because it is difficult, takes more files, or requires understanding an existing implementation.
- Do not replace real behavior with static mock data, hard-coded outcomes, placeholder cards, disabled controls, generic alerts, or a “coming soon” view unless the user explicitly requests a temporary stub.
- Do not flatten a multi-step process into a single button merely to reduce code.
- Do not discard mission state, resource dependencies, event consequences, responsive behavior, theme support, or accessibility while redesigning another area.
- Do not replace the spatial scene with a static image or a few decorative objects and claim the 3D requirement is complete.
- Do not remove tests because they fail after a change. Fix the implementation or update a test only when the intended behavior has deliberately changed and the new behavior is specified.
- Do not delete assets or dependencies before checking all usages and confirming that the replacement works.
- Do not perform broad cleanup, renaming, reformatting, or dependency upgrades unrelated to the task.

When removing or changing existing behavior is genuinely necessary, explain why in the implementation summary and preserve equivalent or better capability. Prefer additive refactoring with a clear migration path over destructive replacement.

## 5. Think in complete user journeys, not isolated components

For every feature, trace the complete journey:

**Briefing → inspect → choose operation → validate → execute → simulate systems → resolve any eligible incident → update objectives → report → next cycle → debrief.**

Check all of the following when relevant:

- What does the learner see before acting?
- What information is known, unknown, or forecast?
- What must be true for the action to be available?
- What exact crew time, resources, assets, and risks does it require?
- What changes immediately and what changes later?
- Which other systems are affected?
- What happens if the action is invalid, interrupted, repeated, or impossible?
- What feedback explains the result?
- Does the scene reflect the new state?
- Does the log/report/debrief preserve the cause and consequence?
- Can the same path be tested and reproduced?

A UI-only implementation is not sufficient for a simulation feature. An engine-only implementation is not sufficient when the learner cannot understand or use the behavior.

## 6. Maintain strict architecture and file boundaries

Keep responsibilities isolated. Every module must have one clear reason to change.

- Keep simulation domain rules outside React components.
- Keep React components focused on presentation and interaction composition; do not put the entire application or mission in one component.
- Keep the 3D renderer and scene assets in their own directory. The scene receives authoritative state and dispatches typed commands; it must not own mission rules.
- Keep mission-specific configuration, actions, event definitions, schedules, assets, and objectives separate from generic engine mechanics.
- Keep each subsystem model in its own module when it has distinct behavior and tests (power, life support, thermal, habitat, crew, mobility, communications, etc.).
- Keep cycle orchestration separate from individual resource/system calculations.
- Keep event eligibility, selection, and resolution separate from event presentation.
- Keep NASA API clients/adapters separate from the core simulation. The engine must not make remote network calls.
- Keep storage/persistence outside pure domain calculations.
- Keep UI primitives reusable and consistent; do not add scattered one-off design systems.
- Share types and stable IDs across the scene, operation panels, engine, and mission definitions instead of duplicating string literals.

Do not create a “god file”, “god component”, or catch-all utility module. Do not move unrelated functions into a single file for convenience. Equally, do not split every three-line helper into its own file without a meaningful boundary. Use professional judgment and preserve cohesive modules.

Before creating a new abstraction, check whether an existing abstraction already solves the problem. Extend it when doing so preserves clarity and compatibility.

## 7. Simulation integrity rules

The mission engine is a source-of-truth domain system, not a visual effect.

- Use explicit units. A number without a unit, capacity, interval, or interpretation is not acceptable for a displayed physical resource.
- Do not treat litres, kilograms, crew-days, kWh, kW, crew-hours, inventory counts, percentages, and condition indices as interchangeable.
- Use configured capacities, rates, thresholds, and cycle duration. Never silently clamp every resource to 0–100.
- Model resource balances and equipment dependencies. If a system consumes power, requires feedstock, degrades, or needs maintenance, those dependencies must affect the result.
- Validate actions inside the engine even if the UI disables invalid actions.
- Rejected actions must not partially mutate the mission state.
- Model crew availability and time when work/EVA constraints matter. Do not allow unlimited operations because the button is visible.
- Use a deterministic seeded random generator. Never call `Math.random()` directly in simulation domain logic.
- Make event eligibility depend on the mission state, environmental context, equipment condition, exposure, and prior decisions where relevant. Add cooldowns and avoid arbitrary emergency spam.
- Give forecastable hazards a useful warning opportunity when the scenario supports it.
- Make objective completion depend on the actual objective condition, not merely on a click.
- Derive all statuses and displayed values from the authoritative engine state. Do not maintain a separate, contradictory “visual health” or “game state” value.
- Do not call an average a probability. Only use probability language when a real, calibrated probability model exists and its limitations are documented.
- Make end conditions explicit and mission-configured. Avoid hidden hard-coded cycle checks scattered through the engine.
- Keep scenario assumptions and educational simplifications visible to future developers and appropriately explained to the learner.
- Test that a seed and action sequence reproduce the same run.

The objective is an internally consistent, teachable systems model—not a flight-certified aerospace model. Never imply a level of physical fidelity the implementation does not provide.

## 8. Spatial / 3D implementation rules

- Treat the 3D view as an operational interface, not a background illustration.
- Every important hotspot must map to a real mission asset ID and have a meaningful inspection or operation interaction.
- The scene must reflect actual asset/system state: condition, availability, warning/critical state, active event, and operation result.
- A mesh click must dispatch the same typed action/inspection command as the corresponding HTML panel. Never create a second simulation path for 3D controls.
- Keep text, forms, detailed telemetry, accessible labels, and important controls in DOM-based UI, not solely in WebGL.
- Make key interactions accessible from a list/inspector for keyboard and screen-reader users.
- Provide responsive fallback behavior. Small screens, reduced capability, WebGL failures, and GPU context loss must not block the mission.
- Keep scene initialization lazy so the landing route does not load the full renderer unnecessarily.
- Respect reduced-motion preferences and provide a static/low-motion mode.
- Profile before adding post-processing, complex shaders, expensive shadows, or high-poly assets.
- Dispose renderer resources and avoid memory leaks on scene unmount, reset, or mission replay.
- Do not animate assets randomly. Any motion must correspond to a real state, operation, environmental input, or clearly labelled ambient background effect.

## 9. Product design and interaction quality

Make the experience feel like a carefully designed scientific operations tool with a compelling spatial environment—not a generic admin dashboard or a cheap arcade game.

- Establish a clear visual hierarchy, spacing system, typography scale, component language, and semantic color tokens before polishing individual panels.
- Build light and dark themes as intentional, readable themes. Check contrast and scene overlays in both.
- Use status color sparingly and consistently. Always pair it with text, iconography, shape, or explanation.
- Avoid excessive cards, thick borders, random gradients, neon glows, noisy charts, unnecessary animation, and stock-looking placeholder copy.
- Use motion to explain state transitions and focus, not as decoration. Respect reduced motion.
- Make high-consequence decisions clear before the user commits. Show costs, requirements, risks, and likely consequences without falsely guaranteeing uncertain outcomes.
- Every visible button, tab, icon control, menu item, link, filter, and hotspot must work or be clearly and intentionally disabled with an explanation.
- Provide useful empty, loading, error, offline, unavailable, confirmation, pending, terminal, and recovery states.
- Design mobile as a first-class layout. Do not merely shrink the desktop workspace.
- Preserve the landing page's purpose: explain the experience, show a truthful preview, and lead directly into the mission.
- Keep copy concise, specific, and scientifically careful. Do not fill the interface with generic motivational sentences.

## 10. NASA data, sources, and attribution

- Verify current NASA API/dataset documentation before implementing a live integration.
- Use external data only when it materially supports the educational mission or site context.
- Keep API keys on the server when required; never commit secrets or expose private keys in client bundles.
- Add timeout, failure, cache, and fallback behavior. External data outages must not prevent mission progression.
- Track source, retrieval time, and relevant transformation/assumption for displayed reference data.
- Distinguish historical data, contextual reference, cached data, and real-time data. Never present one as another.
- Never claim NASA partnership, endorsement, or official training status without explicit permission/evidence.
- Keep attribution and asset licensing visible where required.

## 11. Quality gates are mandatory

Before calling a task complete:

1. Run the narrowest relevant tests while implementing.
2. Run the full typecheck, lint, simulation/UI test suite, and production build before committing when the repository supports them.
3. Manually exercise the affected user journey in a browser, including an error or unavailable path when relevant.
4. Check desktop and mobile layouts for UI work.
5. Check both themes for visual changes.
6. Inspect the diff for accidental file churn, deleted behavior, unused imports/dependencies, debug logging, secrets, and unfinished placeholders.
7. Confirm the relevant TODO items were actually satisfied; do not mark a task complete because the code was written but never verified.

If a command cannot be run because the environment or dependency is unavailable, state exactly what was not verified. Never claim a build, test, or browser check passed without running it.

Do not silence errors with `ignoreBuildErrors`, `@ts-ignore`, broad `any`, fake test assertions, blanket lint disables, or swallowed exceptions. A narrowly justified exception must include an explanation at the point of use.

## 12. Scope control and change management

- Work only on the requested task and its necessary dependencies.
- Before expanding scope, explain why the expansion is necessary to complete the requested behavior.
- Do not opportunistically add features from a brainstorm, another product, or a future phase.
- Prefer completing one coherent vertical slice end to end over starting many disconnected features.
- If a TODO depends on a prerequisite, complete or establish that prerequisite rather than implementing a superficial version of the dependent feature.
- Do not add an API, package, abstraction, state library, animation library, or rendering framework without checking whether it is necessary and compatible with the current project.
- Preserve existing working functionality through refactors. If a behavior is intentionally replaced, verify that the replacement covers its user-facing purpose.
- Keep docs synchronized with actual behavior. Do not document features that do not exist.
- Update `TODO.md` checkboxes only when the associated acceptance conditions are satisfied.
- Report meaningful trade-offs and limitations rather than hiding them.

## 13. Git and commit requirements

**Every completed implementation task must be committed.** Do not leave finished work sitting uncommitted.

At the beginning of the task:

- Inspect `git status`, current branch, and HEAD.
- Preserve any user changes already present. Never use destructive cleanup or reset commands to create a clean workspace.
- Work on an appropriate feature branch unless the user explicitly instructs otherwise or the environment has a branch policy that prevents it.

Before committing:

- Run the quality gates in Section 11.
- Review `git diff` and `git diff --check`.
- Verify that only files relevant to the task are included.
- Never stage secrets, local environment files, caches, generated build output, or unrelated user work.
- Do not amend existing commits, force-push, rewrite shared history, or push directly to a protected branch unless explicitly instructed.

Commit rules:

- Create a meaningful commit for each completed coherent unit of work. Do not create empty commits or combine unrelated features into one vague commit.
- Use a clear conventional-style message, for example `feat(simulation): add deterministic cycle resolution`, `feat(scene): connect asset hotspots to mission state`, `fix(ui): correct mobile operation panel overflow`, or `docs: add mission implementation plan`.
- If tests/build cannot pass due to a confirmed environment blocker, do not conceal it. Commit only when the change is still coherent and safe; include the blocker in the handoff and commit summary.
- Do not claim a commit was created or pushed unless the Git command/tool confirms it.

## 14. Required handoff after each task

Finish with a concise but substantive report containing:

- What changed and why.
- Which user-visible behavior now works end to end.
- Which files/modules were added or changed and their responsibilities.
- Tests, lint, typecheck, build, and manual checks actually performed, with results.
- Known limitations, deferred dependencies, and risks.
- TODO items completed or left open.
- The commit hash and message.

Do not report only “done”. Do not hide failed checks. Do not exaggerate what the implementation does.

## 15. Final standard

Think before editing. Inspect before replacing. Preserve before refactoring. Model before styling. Connect state before animating. Test before claiming completion. Commit the finished work.

The outcome should feel deliberate, coherent, and alive: a learner should be able to enter a mission, understand the environment, interact with assets, make consequential decisions, observe systems respond, and learn from the result. Do not settle for a visually impressive shell around a generic simulation.
