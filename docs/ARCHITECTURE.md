# Architecture

## Resumen

`adconsole` es un frontend Next.js App Router de referencia. No es el backend del producto y no debe absorber responsabilidades que pertenecen a Flamerly.

## Principios

- frontend-only
- UX/UI actual preservada
- mock encapsulado detrás de una capa de datos
- sin `route.ts`
- sin `middleware`
- sin auth propia

## Estructura relevante

- `src/app/`
  - rutas y páginas del prototipo
- `src/components/`
  - componentes visuales y shells client-side
- `src/lib/types/`
  - tipos de dominio base
- `src/lib/adconsole/`
  - frontera de datos y seam de integración

## Frontera de datos actual

El punto de entrada actual es:

- `src/lib/adconsole/config.ts`
- `src/lib/adconsole/repository.ts`
- `src/lib/adconsole/mock-repository.ts`

La regla estructural es:

- la UI no importa `@/lib/mock-data` directamente
- la UI consume solo la capa `src/lib/adconsole/*`

## Arquitectura objetivo

El producto final debe vivir como plugin dentro de Flamerly.

Eso implica que este repo debe asumir:

- auth heredada
- tenant context heredado
- consumo de `/api/ads/v1/*`
- Lumen como integración externa

Eso implica que este repo no debe asumir:

- ownership del backend
- persistencia propia
- sesión propia
- autorización propia

## Riesgos arquitectónicos aún abiertos

- el factory del repositorio todavía debe volverse request-scoped
- el contrato con Flamerly todavía no está formalizado en código
- el mock actual valida la UI y el seam, pero no todavía los estados upstream reales

## Resultado esperado del siguiente ciclo

- factory con contexto por request
- config portable por entorno
- contrato `/api/ads/v1/*` documentado y tipado
- esqueleto visible de `flamerly-repository.ts`
