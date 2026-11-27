# `@trustless-work/escrow` v5 — Qué puedes hacer

Cliente React/TS para escrows Trustless Work Core v2.

Flujo mutate: **build XDR → firmar → `sendTransaction`** (solo REST).  
Lecturas: **elige REST o GraphQL**.

Setup: `TrustlessWorkConfig` (`baseURL`, `apiKey`, opcional `getAccessToken`, `defaultHeaders`).

Identidad: siempre **`contractId`**. Tipos: `single-release` | `multi-release`.

---

## Elegir REST vs GraphQL

```ts
import { useEscrowRest, useEscrowGraphql } from "@trustless-work/escrow";

const rest = useEscrowRest();       // operate + GET /escrows*
const graphql = useEscrowGraphql(); // POST /graphql

// o sin React:
import { TrustlessWorkClient } from "@trustless-work/escrow";
const client = new TrustlessWorkClient({ baseURL, apiKey });
client.rest.deployEscrow(...)
client.graphql.getEscrow({ contractId })
```

Entradas separadas (sin mezclar):

| Import | Contiene |
|--------|----------|
| `@trustless-work/escrow/rest` | servicio REST + hooks REST |
| `@trustless-work/escrow/graphql` | servicio GraphQL + hooks GraphQL |
| `@trustless-work/escrow/hooks/rest` | solo hooks REST |
| `@trustless-work/escrow/hooks/graphql` | solo hooks GraphQL |

---

## REST — Operar (build → sign → send)

| Hook | Acción |
|------|--------|
| `useDeployEscrow` | Crear (`unsignedXdr`, `txHash`, `contractId`) |
| `useFundEscrow` | Fondear |
| `useUpdateEscrow` | Actualizar |
| `useChangeMilestoneStatus` | Status/evidence (batch) |
| `useApproveMilestones` | Aprobar (batch) |
| `useApproveAndReleaseMilestones` | Aprobar + liberar (multi) |
| `useManageMilestones` | Agregar/editar milestones |
| `useReleaseFunds` | Liberar |
| `useStartDispute` / `useResolveDispute` | Disputa |
| `useWithdrawRemainingFunds` | Retirar restante |
| `useSendTransaction` | Enviar XDR firmado |

Deploy: `{ platformId, subjectId }` → `X-TW-Platform` / `X-TW-Subject`.

---

## REST — Leer

| Hook | Endpoint |
|------|----------|
| `useListEscrows` | `GET /escrows` |
| `useGetEscrow` | `GET /escrows/:contractId` |
| `useGetEscrowDetails` | `GET /escrows/details` |
| `useListEscrowEvents` | `GET /escrows/:id/events` |
| `useGetEscrowMilestones` / `useGetEscrowsMilestones` | milestones |
| `useGetEscrowsFinancial` | `GET /escrows/financial` |

---

## REST — CCTP (pago cross-chain del receiver)

| Hook | Acción |
|------|--------|
| `useSetCrossChainDestination` | Registrar destino (firma el receiver; devuelve `estimatedFeeUsdc`) |
| `useClearCrossChainDestination` | Borrar destino (firma el receiver) |
| `useGetCrossChainDestination` | Leer destino (`null` = pago en Stellar) |
| `useGetCctpFeeQuote` | Costo estimado del forwarding |
| `useGetCctpAttestation` | Estado de la quema CCTP |

Multi-release: por milestone (`milestoneIndex`).

---

## GraphQL — Leer escrows (`POST /graphql`)

| Hook | Query |
|------|-------|
| `useGraphqlGetEscrow` | `escrow(contractId)` + financial/deposits/events |
| `useGraphqlListEscrows` | `escrows(...)` (mismos filtros que REST) |

Documentos: `GRAPHQL_GET_ESCROW`, `GRAPHQL_LIST_ESCROWS`.

---

## Fuera de scope

auth, users, platforms, wallets, admin, access grants.
