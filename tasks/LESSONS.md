# Lessons Learned

## 2026-03-31

### Preserve the prototype surface while changing data access

- the safest path is to refactor data seams first and keep the UI composition stable
- dashboard-first fold is the most visually sensitive area and should be treated as regression-critical

### Do not let the mock leak into UI modules

- direct imports from `@/lib/mock-data` inside `src` are a structural regression
- all domain data should flow through `src/lib/adconsole/*`

### Avoid accidental architecture drift

- adding backend, auth, `route.ts`, or `middleware` to this repo would contradict the intended Flamerly plugin architecture

### Local cleanup matters

- duplicate artifacts with suffix ` 2` were enough to break linting and obscure real repo status
- local operational files such as `EXECUTION_HANDOFF.md` should stay out of version control via local exclude rules

### Portability is a first-class requirement

- tracked docs must not depend on personal absolute paths if the repo is meant to be shared for external validation

### Plugin-ready error handling must be consistent across server routes

- if one route translates upstream/auth/tenant failures into UI states, all repository-backed server routes should follow the same loader-state pattern
- placeholder adapters such as `flamerly-repository.ts` should throw typed data errors, not generic errors, so fallback UI remains consistent

### Request-scoped means request-derived

- passing a `context` object is not enough if its tenant and token still come only from process env
- real plugin seams must resolve auth and tenant from request inputs such as headers or cookies
