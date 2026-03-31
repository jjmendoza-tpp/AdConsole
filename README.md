# adconsole

Frontend de referencia del prototipo de Ad Console desplegado en Vercel y preparado para futura integración con Flamerly.

## Qué es este repo

- Prototipo frontend de alta fidelidad para revisión interna DEV/CTO/product/design.
- Implementación Next.js App Router + shadcn, sin backend propio.
- Capa de datos desacoplada y plugin-ready, pensada para reemplazar el mock por consumo de `/api/ads/v1/*` dentro de Flamerly.

## Estado actual

- Nombre canónico local del proyecto: `adconsole`
- Proyecto real en Vercel: `adconsole`
- URL estable de producción: `https://adconsole.vercel.app`
- `main` representa el estado técnico de referencia del prototipo
- El frontend sigue usando datos mock a través de `src/lib/adconsole/*`
- No existen `route.ts`, `middleware` ni auth propia en este repo
- La documentación operativa compartible vive en `docs/`
- El deployment visual de Vercel puede requerir acceso autenticado al proyecto si Vercel Authentication sigue activa

## Arquitectura

- Este repo es solo frontend.
- La arquitectura objetivo del producto exige que Ad Console viva como plugin dentro de Flamerly.
- La ruta de integración futura del frontend es:
  - auth heredada de Flamerly
  - contexto multi-tenant heredado de Flamerly
  - endpoints REST en `/api/ads/v1/*`
  - Lumen tratado como integración externa, no como backend embebido aquí

La frontera de datos actual está en:

- `src/lib/adconsole/config.ts`
- `src/lib/adconsole/repository.ts`
- `src/lib/adconsole/mock-repository.ts`

La UI no debe importar `@/lib/mock-data` directamente. El mock solo vive detrás del repositorio.

## Documentación del repo

- `docs/SETUP.md`
- `docs/ARCHITECTURE.md`
- `docs/FLAMERLY_INTEGRATION.md`
- `docs/QA_CHECKLIST.md`
- `docs/EXECUTION_PLAN.md`
- `docs/STATUS.md`

## Contexto externo no incluido

- La fuente de verdad de negocio y diseño vive fuera de este repo compartido.
- Este repositorio contiene únicamente el contexto técnico necesario para ejecutar, revisar y endurecer el prototipo.
- Si un dev necesita contrastar decisiones de producto con material interno, debe solicitar acceso al owner del producto en lugar de depender de rutas locales de otra máquina.

## Desarrollo local

```bash
git clone <repo-url>
cd ad_console_prototype
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Validación

```bash
npm run lint
npm run build
```

Para la secuencia de revisión técnica completa, ver `docs/QA_CHECKLIST.md`.

`npm run build` puede emitir warnings conocidos de Recharts durante prerender por tamaños `width(-1)` o `height(-1)`. Hoy se consideran no bloqueantes mientras el build complete correctamente.

## Qué sigue siendo mock

- Dashboard KPIs y revenue
- Analytics operativos
- Listados y detalles de campañas
- Listados y detalles de anunciantes
- Espacios publicitarios
- Keywords
- Wizard de creación de campañas

## Qué falta para implementación real

- Cliente REST real hacia Flamerly `/api/ads/v1/*`
- Sesión heredada de Flamerly
- Tenant context real
- Persistencia real de formularios y acciones
- Hardening de permisos/roles según Flamerly

## Matriz de compatibilidad

| Ya compatible | Compatible tras este refactor | Fuera de alcance del prototipo |
| --- | --- | --- |
| Dominio base con tipos de campañas, anunciantes, espacios y tenant | Reemplazo del mock por repositorio REST a Flamerly sin reescribir vistas | Backend/plugin dentro de Flamerly |
| Frontend separado en Vercel | Auth y multi-tenant heredados vía capa de datos | API routes internas de Next.js en este repo |
| UX/UI actual preservada | Integración con `/api/ads/v1/*` | Persistencia real y workflows comerciales |
| Shell y navegación del prototipo | Migración gradual del mock a datos reales por método | Seguridad operativa del backend de Flamerly |

## Checklist DEV/CTO

- `git status` sin basura local
- `npm run lint`
- `npm run build`
- sin imports directos a `@/lib/mock-data` en `src`
- naming homologado a `adconsole`
- README coherente con GitHub, Vercel y arquitectura de producto
- sin backend ni auth propios agregados en este repo

## Notas operativas

- `.claude/`, `.gstack/`, `.next/`, `.vercel/` y `node_modules/` son artefactos locales.
- `EXECUTION_HANDOFF.md` puede mantenerse localmente como documento operativo, pero no forma parte del repo compartido.
- La zona más sensible de QA visual sigue siendo el primer fold del dashboard: sidebar, top header, KPI cards, revenue chart, breakdown y tabla principal.
- Para compartir el prototipo:
  - usar el repo Git como fuente técnica oficial
  - usar `https://adconsole.vercel.app` como referencia visual y de QA cuando el reviewer tenga acceso
  - no usar `.zip` como vía principal de colaboración
