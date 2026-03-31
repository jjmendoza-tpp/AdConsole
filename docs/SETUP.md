# Setup

## Prerequisitos

- Node.js 20 o superior
- npm 10 o superior
- acceso al repo Git

## Instalación

```bash
git clone <repo-url>
cd ad_console_prototype
npm install
cp .env.example .env.local
```

## Ejecución local

```bash
npm run dev
```

Abrir `http://localhost:3000`.

## Validación local mínima

```bash
npm run lint
npm run build
npm run test:smoke
```

## Modo actual

- el repo corre hoy en modo `mock`
- no requiere backend local
- no requiere auth real
- no requiere credenciales privadas para renderizar la UI actual

## Runtime config

Variables soportadas:

- `ADCONSOLE_DATA_SOURCE`
  - valores: `mock`, `flamerly`
  - default actual recomendado: `mock`
- `ADCONSOLE_FLAMERLY_API_BASE_PATH`
  - default: `/api/ads/v1`
- `ADCONSOLE_TENANT_ID`
  - opcional
- `ADCONSOLE_ACCESS_TOKEN`
  - opcional

Notas:

- mientras `ADCONSOLE_DATA_SOURCE=mock`, no se necesitan credenciales reales
- `flamerly` queda reservado para el adapter futuro y no debe activarse todavía en este ciclo

## Qué no existe en este repo

- `route.ts`
- `middleware`
- backend propio
- auth propia
- tenant resolution real

## Cómo debe usarlo un dev nuevo

1. Clonar el repo.
2. Instalar dependencias.
3. Correr `npm run lint`.
4. Correr `npm run build`.
5. Correr `npm run dev`.
6. Revisar `docs/ARCHITECTURE.md` y `docs/FLAMERLY_INTEGRATION.md`.
7. Correr `npm run test:smoke`.
8. Usar el deployment de Vercel solo como referencia visual si necesita comparar la UI.

## Distribución recomendada

- fuente técnica oficial: repo Git
- referencia funcional/visual: deployment de Vercel
- `.zip`: solo excepción puntual
