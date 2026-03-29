# Ad Console Prototype

Reference frontend for the Ad Console prototype published on Vercel.

## Branches

- `main`: exact baseline for the production deployment `https://prototype-two-dun.vercel.app`
- `codex/stitch-followup`: local follow-up work after the deployed baseline

The production baseline corresponds to commit `43496e7d6103fc0d4725550ac0e62694d400bff2` and is also tagged as `deploy/prototype-two-dun-2026-03-28`.

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validation

```bash
npm run lint
npm run build
```

`npm run build` may emit Recharts static-generation width/height warnings during prerender. They are known non-blocking warnings for this prototype.

## Notes

- The repo is intended as a reusable reference for code-generation tools and future prototype iterations.
- Local-only folders such as `.claude/`, `.gstack/`, `.next/`, `node_modules/`, and `.vercel/` are excluded from Git history.
