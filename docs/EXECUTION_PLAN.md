# Execution Plan: Flamerly Plugin-Ready Hardening

## Objective

Leave `adconsole` portable, reviewable, and materially closer to a Flamerly plugin integration without adding backend ownership to this repo or changing the current UX/UI.

## Scope

In scope:
- repo portability for external devs
- technical handoff documentation inside the repo
- request-scoped data layer refactor
- portable runtime configuration
- explicit Flamerly integration contract
- `flamerly-repository.ts` skeleton, not implemented
- smoke tests for critical routes

Out of scope:
- real Flamerly API client implementation
- auth implementation in this repo
- tenant resolution implementation in this repo
- Next.js `route.ts` or `middleware`
- UI redesign

## Baseline

Already completed before this plan:
- naming normalized to `adconsole`
- duplicate local files with suffix ` 2` removed
- direct `@/lib/mock-data` imports removed from `src`
- async repository seam introduced under `src/lib/adconsole/`
- README aligned with current technical direction
- `npm run lint` passing
- `npm run build` passing

Known baseline risks:
- Recharts emits non-blocking prerender warnings during `build`
- data layer is still mock-backed
- repository factory is not yet request-scoped
- tracked docs still need to be made fully portable for external contributors

## Phase Map

### Phase 0: Traceability and Continuity
Status: `done`

Goal:
- make the plan durable across sessions

Deliverables:
- `docs/EXECUTION_PLAN.md`
- `docs/STATUS.md`
- `docs/DECISIONS.md`
- `tasks/TODO.md`
- `tasks/LESSONS.md`

Exit criteria:
- repo contains a clear execution source of truth
- next phase can start without reconstructing chat context

### Phase 1: Portability and Developer Handoff
Status: `done`

Goal:
- remove machine-specific dependencies from tracked docs and setup flow

Tasks:
- remove absolute local-machine paths from tracked docs
- write `docs/SETUP.md`
- write `docs/ARCHITECTURE.md`
- write `docs/FLAMERLY_INTEGRATION.md`
- write `docs/QA_CHECKLIST.md`
- update `README.md` to point to internal repo docs only

Exit criteria:
- a new dev can clone and understand local setup without personal path references

Validation:
- `git grep '/Users/josejuanmendoza'`

### Phase 2: Request-Scoped Repository
Status: `done`

Goal:
- refactor the data seam so future Flamerly integration can be context-aware

Tasks:
- define `AdConsoleRequestContext`
- refactor repository factory to accept context
- update route/page loaders to build repositories with context

Exit criteria:
- repository creation is explicit and request-scoped

Validation:
- typecheck through `npm run build`

### Phase 3: Portable Runtime Config
Status: `done`

Goal:
- support portable repo execution across environments

Tasks:
- harden `src/lib/adconsole/config.ts`
- support `mock` and `flamerly` modes
- add `.env.example`
- document config defaults

Exit criteria:
- project runs in mock mode with documented defaults and no private machine setup

### Phase 4: Flamerly Integration Contract
Status: `done`

Goal:
- define the interface boundary to `/api/ads/v1/*`

Tasks:
- add `src/lib/adconsole/contracts.ts`
- document request/response shapes and error cases
- map contract shapes to UI/domain types already in use

Exit criteria:
- frontend and backend teams can discuss integration using a single contract source

### Phase 5: Flamerly Repository Skeleton
Status: `done`

Goal:
- make the future adapter explicit without implementing it

Tasks:
- add `src/lib/adconsole/flamerly-repository.ts`
- implement interface surface with `not implemented` guards
- wire selection by mode without enabling production usage

Exit criteria:
- repository interface has a visible mock implementation and a visible Flamerly adapter seam

### Phase 6: Domain Data Normalization
Status: `done`

Goal:
- move remaining domain-like constants out of views where needed

Tasks:
- inspect analytics, detail pages, and wizard flows
- move domain data into repository/fixtures where appropriate
- keep only purely presentational constants inside UI

Exit criteria:
- domain data is not silently fragmented across UI components

### Phase 7: Integration States
Status: `done`

Goal:
- prepare the UI for realistic upstream states

Tasks:
- define patterns for loading, empty, unauthorized, tenant-missing, and upstream-error states
- add minimal consistent handling without redesign

Exit criteria:
- the app has a clear path to support real upstream states

### Phase 8: Smoke Tests
Status: `done`

Goal:
- add quick confidence checks for the main prototype surfaces

Tasks:
- add smoke coverage for `/`
- add smoke coverage for `/campaigns`
- add smoke coverage for `/advertisers/[id]`
- add smoke coverage for `/campaigns/new`

Exit criteria:
- critical routes can be validated quickly in CI or by new devs

### Phase 9: Final Validation and Shareability Check
Status: `done`

Goal:
- verify repo readiness for DEV/CTO and developer handoff

Tasks:
- run lint, build, smoke tests
- confirm no direct mock imports in `src`
- confirm no local path references remain in tracked docs
- confirm no `route.ts` or `middleware`

Exit criteria:
- repo is ready to share as the official Git source plus Vercel reference deployment

## Sequencing

Recommended order:
1. Phase 0
2. Phase 1
3. Phase 2
4. Phase 3
5. Phase 4
6. Phase 5
7. Phase 6
8. Phase 7
9. Phase 8
10. Phase 9

## Session Handoff Protocol

At the end of each session:
- update `docs/STATUS.md`
- update `tasks/TODO.md`
- add any architectural decisions to `docs/DECISIONS.md`
- record any repeatable mistakes or discoveries in `tasks/LESSONS.md`

If a session is interrupted:
- resume from `docs/STATUS.md`
- do not infer phase progress from chat history alone
