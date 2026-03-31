# QA Checklist

## Validación rápida para DEV/CTO

### Estado del repo

- `git status --short --branch`
- confirmar que no hay basura local inesperada

### Higiene estructural

- `git grep -n "@/lib/mock-data" -- src`
- resultado esperado: sin matches

### Calidad estática

- `npm run lint`
- resultado esperado: pass

### Build

- `npm run build`
- resultado esperado: pass
- nota: warnings de Recharts durante prerender son conocidos y no bloqueantes mientras el build complete

### Smoke

- `npm run test:smoke`
- resultado esperado:
  - `/` responde y contiene `Dashboard`
  - `/campaigns` responde y contiene `Campañas`
  - `/advertisers/adv-001` responde y contiene `Medalla Light`
  - `/campaigns/new` responde y contiene `Nueva Campaña`

### Verificación visual mínima

Con `npm run dev` o el deployment de Vercel:

- dashboard carga
- KPI cards visibles
- revenue chart visible
- channel breakdown visible
- tabla principal visible
- `/campaigns` carga
- `/campaigns/new` carga
- `/advertisers` carga
- `/analytics` carga

### Arquitectura

- confirmar ausencia de `route.ts`
- confirmar ausencia de `middleware`
- confirmar que el repo sigue frontend-only

### Compartición

- repo Git como fuente oficial
- deployment de Vercel como referencia visual
- no distribuir como `.zip` salvo excepción
