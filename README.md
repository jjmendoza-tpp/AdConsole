# Ad Console Prototype

Reference frontend for the Ad Console prototype published on Vercel.

## Current status

- Production alias: `https://prototype-two-dun.vercel.app`
- Current exact deployment: `https://prototype-5au1czrdw-jjmendoza-1028s-projects.vercel.app`
- Current production-facing refinement commit: `ae59335ed23309af9b2f00bbd1e2ee6fcf0bdedf`
- Historical deployed baseline commit: `43496e7d6103fc0d4725550ac0e62694d400bff2`

## Branches

- `main`: production-ready prototype state and current source of truth for Vercel
- `codex/stitch-followup`: local follow-up work after the original deployed baseline
- `import/vercel-baseline`: sanitized baseline imported when the GitHub repo already had history
- `import/local-followup`: imported branch preserving post-baseline exploration

The original production deployment corresponds to commit `43496e7d6103fc0d4725550ac0e62694d400bff2`.

The repository first preserved that baseline in sanitized form so it could be shared safely. Since then, `main` has advanced to become the production-ready reference branch for the current Stitch-aligned prototype.

## Design source of truth

Use these sources in this order:

1. `/Users/josejuanmendoza/Documents/Prometheus/01_PRODUCTOS/Ad_Console/diseno/stitch_ad_console_shop.pr`
2. `/Users/josejuanmendoza/Documents/Prometheus/01_PRODUCTOS/Ad_Console/diseno/DESIGN_SYSTEM.md`
3. `/Users/josejuanmendoza/Documents/Prometheus/01_PRODUCTOS/Ad_Console/diseno/PANTALLAS.md`
4. Figma and Stitch MCP, if available in the current session

When Stitch MCP is unavailable, the local export under `diseno/stitch_ad_console_shop.pr/` is the mandatory fallback.

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

If local `next build` hangs:

- check for lingering `next build`, `eslint`, or `.next/build/postcss.js` processes
- kill orphaned workers before retrying
- rely on the Vercel remote build as the final release gate when the local machine is unstable

## Deploy

Preferred production paths:

1. Push the validated commit to GitHub `main`
2. Confirm that Vercel creates a new deployment for `main`
3. If the Git-triggered deployment is canceled, use:

```bash
npx vercel --prod
```

Then verify:

- production alias resolves correctly
- the served HTML contains the expected shell/dashboard markers
- the first visible viewport actually matches the intended Stitch reference

## Notes

- The repo is intended as a reusable reference for code-generation tools and future prototype iterations.
- Local-only folders such as `.claude/`, `.gstack/`, `.next/`, `node_modules/`, and `.vercel/` are excluded from Git history.
- Preserve the current Next.js/shadcn architecture. Do not replace the shell or component system unless the user explicitly asks for an architectural change.
- The most important visual QA area is the dashboard first fold: sidebar, top header, KPI cards, revenue chart, donut card, and top campaigns table.
