# Decisions Log

## 2026-03-31

### Distribution model

Decision:
- share the project primarily as a Git repo plus a Vercel deployment reference

Rationale:
- the repo is the source of truth for setup, validation, and integration work
- Vercel is the fastest way for product and architecture reviewers to inspect the behavior
- `.zip` is not suitable as the primary collaboration artifact

### Flamerly integration strategy

Decision:
- keep this repo frontend-only and plugin-ready, without backend or internal Next.js API routes

Rationale:
- product architecture requires auth, tenant context, and `/api/ads/v1/*` to live in Flamerly

### Future adapter visibility

Decision:
- include `src/lib/adconsole/flamerly-repository.ts` even if it remains unimplemented in this cycle

Rationale:
- it makes the integration seam explicit for frontend and backend teams

### Validation scope for the next cycle

Decision:
- smoke tests are included in the current hardening cycle

Rationale:
- the repo needs a lightweight confidence layer before sharing with external devs

### Session continuity

Decision:
- execution state must be tracked inside the repo, not only in chat context

Rationale:
- the work will likely continue across multiple sessions and potentially multiple operators
