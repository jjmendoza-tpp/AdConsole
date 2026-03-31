# Flamerly Integration

## Objetivo

Preparar este frontend para integrarse como plugin de Flamerly sin reescribir las vistas actuales.

## Supuestos del modelo final

- Flamerly provee auth
- Flamerly provee tenant context
- Flamerly expone los endpoints `/api/ads/v1/*`
- este repo consume esa frontera desde una capa desacoplada

## Contrato objetivo

El siguiente ciclo debe formalizar el contrato para:

- `GET /api/ads/v1/dashboard`
- `GET /api/ads/v1/campaigns`
- `GET /api/ads/v1/campaigns/:id`
- `GET /api/ads/v1/advertisers`
- `GET /api/ads/v1/advertisers/:id`
- `GET /api/ads/v1/ad-spaces`
- `GET /api/ads/v1/keywords`

La referencia tipada del contrato ahora vive en:

- `src/lib/adconsole/contracts.ts`

## Envelope propuesto

- respuestas de entidad: `FlamerlyEntityResponse<T>`
- respuestas de colección: `FlamerlyCollectionResponse<T>`
- metadata mínima:
  - `tenantId`
  - `requestId`
  - `generatedAt`

## Endpoints y shapes

| Endpoint | Shape |
| --- | --- |
| `GET /api/ads/v1/dashboard` | `DashboardContractResponse` |
| `GET /api/ads/v1/campaigns` | `CampaignsContractResponse` |
| `GET /api/ads/v1/campaigns/:id` | `CampaignByIdContractResponse` |
| `GET /api/ads/v1/advertisers` | `AdvertisersContractResponse` |
| `GET /api/ads/v1/advertisers/:id` | `AdvertiserByIdContractResponse` |
| `GET /api/ads/v1/ad-spaces` | `AdSpacesContractResponse` |
| `GET /api/ads/v1/keywords` | `KeywordsContractResponse` |

## Contexto que la capa de datos debe recibir

- `mode`
- `tenantId`
- `accessToken`
- `apiBasePath`

## Lo que ya está listo

- la UI ya no depende directamente de `@/lib/mock-data`
- existe una interfaz async de repositorio
- el mock actual ya cuelga de esa interfaz

## Lo que falta para quedar más cerca de Flamerly

- preparar estados de loading, empty y upstream error

## Adapter skeleton actual

- `src/lib/adconsole/flamerly-repository.ts` ya existe
- implementa la misma interfaz que el mock repository
- hoy responde con guards de `not implemented`
- no debe activarse en runtime mientras el adapter real no exista

## Errores upstream esperados

- `401 unauthorized`
- `403 forbidden`
- `404 not_found`
- `422 validation_error`
- `503 upstream_unavailable`
- `tenant_missing`

## Lo que sigue fuera de alcance

- implementar auth en este repo
- implementar backend en este repo
- crear API routes internas de Next.js
- mover aquí la lógica multi-tenant propietaria de Flamerly
