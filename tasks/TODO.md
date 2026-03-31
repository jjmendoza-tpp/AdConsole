# TODO

## Phase Status

- [x] Phase 0: Traceability and Continuity
- [x] Phase 1: Portability and Developer Handoff
- [x] Phase 2: Request-Scoped Repository
- [x] Phase 3: Portable Runtime Config
- [x] Phase 4: Flamerly Integration Contract
- [x] Phase 5: Flamerly Repository Skeleton
- [x] Phase 6: Domain Data Normalization
- [x] Phase 7: Integration States
- [x] Phase 8: Smoke Tests
- [x] Phase 9: Final Validation and Shareability Check

## Phase 0: Traceability and Continuity
Status: `done`

- [x] Create `docs/EXECUTION_PLAN.md`
- [x] Create `docs/STATUS.md`
- [x] Create `docs/DECISIONS.md`
- [x] Create `tasks/TODO.md`
- [x] Create `tasks/LESSONS.md`

## Phase 1: Portability and Developer Handoff
Status: `done`

- [x] Remove personal machine paths from tracked docs
- [x] Update `README.md` to point to repo-local docs only
- [x] Create `docs/SETUP.md`
- [x] Create `docs/ARCHITECTURE.md`
- [x] Create `docs/FLAMERLY_INTEGRATION.md`
- [x] Create `docs/QA_CHECKLIST.md`
- [x] Add clone/install/run instructions for a new dev
- [x] Add sharing instructions for Git repo + Vercel deployment

## Phase 2: Request-Scoped Repository
Status: `done`

- [x] Define `AdConsoleRequestContext`
- [x] Refactor repository factory to accept context
- [x] Update pages/loaders to pass context explicitly
- [x] Derive request context from server headers/cookies instead of process-global tenant/token defaults
- [x] Keep mock mode as the active runtime path

## Phase 3: Portable Runtime Config
Status: `done`

- [x] Support `mock` mode in config using documented defaults
- [x] Define `flamerly` mode shape without activating it
- [x] Create `.env.example`
- [x] Document runtime config in `docs/SETUP.md`

## Phase 4: Flamerly Integration Contract
Status: `done`

- [x] Create `src/lib/adconsole/contracts.ts`
- [x] Define contract shapes for dashboard, campaigns, advertisers, ad spaces, and keywords
- [x] Define expected upstream error cases
- [x] Document `/api/ads/v1/*` integration boundary

## Phase 5: Flamerly Repository Skeleton
Status: `done`

- [x] Create `src/lib/adconsole/flamerly-repository.ts`
- [x] Implement interface surface with `not implemented` guards
- [x] Document that the skeleton is intentionally inactive

## Phase 6: Domain Data Normalization
Status: `done`

- [x] Audit analytics constants
- [x] Audit detail-page constants
- [x] Audit wizard constants
- [x] Move domain-like data out of views where appropriate

## Phase 7: Integration States
Status: `done`

- [x] Define loading state handling
- [x] Define empty state handling
- [x] Define unauthorized state handling
- [x] Define tenant-missing state handling
- [x] Define upstream-error state handling

## Phase 8: Smoke Tests
Status: `done`

- [x] Choose the lightest viable test approach for this repo
- [x] Add smoke test for `/`
- [x] Add smoke test for `/campaigns`
- [x] Add smoke test for `/advertisers/[id]`
- [x] Add smoke test for `/campaigns/new`
- [x] Document how to run smoke tests locally

## Phase 9: Final Validation and Shareability Check
Status: `done`

- [x] Run `npm run lint`
- [x] Run `npm run build`
- [x] Run smoke tests
- [x] Confirm no direct mock imports in `src`
- [x] Confirm no personal machine paths remain in tracked docs
- [x] Confirm no `route.ts` and no `middleware`
- [x] Confirm repo is ready to share with DEV/CTO
