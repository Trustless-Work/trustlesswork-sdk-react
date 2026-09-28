<p align="center"> <img src="https://github.com/user-attachments/assets/5b182044-dceb-41f5-acf0-da22dea7c98a" alt="CLR-S (2)"> </p>

# Trustless Work <a href="https://www.npmjs.com/package/@trustless-work/escrow" target="_blank">React Library</a>

**`@trustless-work/escrow` v5** — React/TypeScript client for Trustless Work **Core API v2** escrows.

| Surface           | What it does                                                  |
| ----------------- | ------------------------------------------------------------- |
| **REST operate**  | Build unsigned XDR → you sign → `sendTransaction`             |
| **REST reads**    | `GET /escrows*` (list, detail, events, milestones, financial) |
| **GraphQL reads** | `POST /graphql` (`escrow` / `escrows`)                        |

Identity is always **`contractId`** (Soroban `C…`). Types: `single-release` | `multi-release`.

> Auth, users, platforms, wallets, admin, and access grants are **out of scope** for this package.

## Installation

```bash
npm i @trustless-work/escrow@beta
```

Peer dependencies: `react` and `react-dom` `>=18 <20`.

If you publish/install under an npm dist-tag (e.g. `beta`), use that tag instead of `@5` so `latest` can stay on the audited Core v1 line.

## Quick Start

```tsx
"use client";

import { development, TrustlessWorkConfig } from "@trustless-work/escrow";

export function TrustlessWorkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";

  return (
    <TrustlessWorkConfig baseURL={development} apiKey={apiKey}>
      {children}
    </TrustlessWorkConfig>
  );
}
```

Optional wallet-session auth and default platform header:

```tsx
<TrustlessWorkConfig
  baseURL={development}
  apiKey={apiKey}
  getAccessToken={() => sessionToken}
  defaultHeaders={{ "X-TW-Platform": platformId }}
>
  {children}
</TrustlessWorkConfig>
```

| Prop             | Role                                                                 |
| ---------------- | -------------------------------------------------------------------- |
| `baseURL`        | Core API host (`development` / `mainNet` helpers, or any URL string) |
| `apiKey`         | `x-api-key` header                                                   |
| `getAccessToken` | Optional Bearer token getter (re-read per request)                   |
| `defaultHeaders` | Merged into every request (e.g. `X-TW-Platform`)                     |

### Without React

```ts
import { TrustlessWorkClient, development } from "@trustless-work/escrow";

const client = new TrustlessWorkClient({
  baseURL: development,
  apiKey: process.env.API_KEY,
});

await client.rest.listEscrows({ scope: "mine", limit: 20 });
await client.graphql.getEscrow({ contractId });
```

## Package entry points

| Import                                 | Contains                                            |
| -------------------------------------- | --------------------------------------------------- |
| `@trustless-work/escrow`               | Config, client, REST + GraphQL hooks, types, errors |
| `@trustless-work/escrow/rest`          | `EscrowRestService` + REST hooks only               |
| `@trustless-work/escrow/graphql`       | GraphQL service, documents, GraphQL hooks           |
| `@trustless-work/escrow/hooks`         | All hooks (REST + GraphQL)                          |
| `@trustless-work/escrow/hooks/rest`    | REST hooks only                                     |
| `@trustless-work/escrow/hooks/graphql` | GraphQL hooks only                                  |
| `@trustless-work/escrow/types`         | Payloads, responses, read-model, entities           |

```tsx
import { useEscrowRest, useEscrowGraphql } from "@trustless-work/escrow";
import { useGraphqlGetEscrow } from "@trustless-work/escrow/hooks/graphql";

const rest = useEscrowRest(); // operate + GET /escrows*
const graphql = useEscrowGraphql(); // POST /graphql
const { getEscrow } = useGraphqlGetEscrow();
```

## Build → sign → send

Every mutate hook returns an **unsigned** transaction. You sign with the wallet, then submit.

```tsx
import {
  useDeployEscrow,
  useSendTransaction,
  toTrustlessWorkError,
  TrustlessWorkApiError,
  formatApiErrorMessage,
} from "@trustless-work/escrow";
import type { DeploySingleReleaseEscrowPayload } from "@trustless-work/escrow/types";

const { deployEscrow } = useDeployEscrow();
const { sendTransaction } = useSendTransaction();

const onSubmit = async (payload: DeploySingleReleaseEscrowPayload) => {
  try {
    const { unsignedXdr, contractId } = await deployEscrow(
      payload,
      "single-release",
      // optional attribution → X-TW-Platform / X-TW-Subject:
      // { platformId, subjectId }
    );

    const signedXdr = await signWithWallet(unsignedXdr);
    const result = await sendTransaction(signedXdr);
    // result.txHash, result.ledger, result.contractId?, result.escrow?, result.code?

    if (result.code === "STELLAR_TX_SUBMITTED_INDEXER_LAGGING") {
      // Tx is on-chain; poll GET /escrows/:contractId until the indexer catches up
    }
  } catch (error: unknown) {
    const normalized = toTrustlessWorkError(error);
    if (normalized instanceof TrustlessWorkApiError) {
      console.error(formatApiErrorMessage(normalized), normalized.code);
    }
    throw error;
  }
};
```

Deploy trustline shape: `{ contractId, symbol }` (Soroban SAC `C…` + asset code).

Operate responses:

| Step         | Type                       | Shape                                                       |
| ------------ | -------------------------- | ----------------------------------------------------------- |
| Deploy build | `DeployEscrowResponse`     | `{ unsignedXdr, txHash, contractId }`                       |
| Other builds | `BuildTransactionResponse` | `{ unsignedXdr, txHash }`                                   |
| Submit       | `SendTransactionResponse`  | `{ txHash, ledger, contractId?, escrow?, code?, message? }` |

`code` may be `STELLAR_TX_SUBMITTED` or `STELLAR_TX_SUBMITTED_INDEXER_LAGGING`.

## Operate hooks (REST only)

Import from `@trustless-work/escrow`, `@trustless-work/escrow/hooks`, or `@trustless-work/escrow/hooks/rest`.

| Hook                             | Action                                                 |
| -------------------------------- | ------------------------------------------------------ |
| `useDeployEscrow`                | Create escrow (`unsignedXdr` + predicted `contractId`) |
| `useFundEscrow`                  | Fund                                                   |
| `useUpdateEscrow`                | Update properties                                      |
| `useChangeMilestoneStatus`       | Status / evidence (batch)                              |
| `useApproveMilestones`           | Approve (batch)                                        |
| `useApproveAndReleaseMilestones` | Approve + release (multi-release)                      |
| `useManageMilestones`            | Add / edit milestones                                  |
| `useReleaseFunds`                | Release                                                |
| `useStartDispute`                | Start dispute                                          |
| `useResolveDispute`              | Resolve dispute (distributions)                        |
| `useWithdrawRemainingFunds`      | Withdraw remaining                                     |
| `useSendTransaction`             | Submit signed XDR (`POST /stellar/send-transaction`)   |

Most operate methods take `(payload, type)` where `type` is `"single-release"` | `"multi-release"`. Multi-only helpers (`approveAndReleaseMilestones`, etc.) omit the type argument.

## Reads — REST

| Hook                      | Endpoint                               |
| ------------------------- | -------------------------------------- |
| `useListEscrows`          | `GET /escrows`                         |
| `useGetEscrow`            | `GET /escrows/:contractId`             |
| `useGetEscrowDetails`     | `GET /escrows/details?contractIds=`    |
| `useListEscrowEvents`     | `GET /escrows/:contractId/events`      |
| `useGetEscrowMilestones`  | `GET /escrows/:contractId/milestones`  |
| `useGetEscrowsMilestones` | `GET /escrows/milestones?contractIds=` |
| `useGetEscrowsFinancial`  | `GET /escrows/financial?contractIds=`  |

```tsx
import {
  useListEscrows,
  useGetEscrow,
} from "@trustless-work/escrow/hooks/rest";
import { useQuery } from "@tanstack/react-query";

const { listEscrows } = useListEscrows();
const { getEscrow } = useGetEscrow();

useQuery({
  queryKey: ["escrows", "mine"],
  queryFn: () => listEscrows({ scope: "mine", limit: 20 }),
});

useQuery({
  queryKey: ["escrow", contractId],
  queryFn: () => getEscrow(contractId),
  enabled: !!contractId,
});
```

### `ListEscrowsParams` (filters)

`scope`, `status`, `type`, `engagementId`, `contractIds`, `participant`, `role`, `platformId`, `subjectId`, `createdAfter`, `createdBefore`, `limit`, `cursor`, `sort`, `order`.

- Use `scope: "mine" | "all"` for segmentation (not per-escrow access grants).
- List/events return a **keyset page**: `{ data, hasMore, nextCursor }`.

### Read-model shapes

| Type              | Notes                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------ |
| `EscrowSummary`   | List/detail row: `contractId`, `type`, `status`, `balance`, `asset`, camelCased `snapshot` |
| `EscrowDetail`    | `{ escrow, events, deposits }`                                                             |
| `EscrowFinancial` | Batch financial: deposited / released / pending / `balance`                                |
| `EscrowEvent`     | Indexed event (`kind`, `topics`, `payload`, …) — no UUID event `id`                        |
| `EscrowDeposit`   | Deposit row — no UUID deposit `id`                                                         |

There is **no** UUID `id` / `escrowId`. Amounts on reads are **human decimal strings** (e.g. `"250.5"`) — do **not** divide by `1e7`. Build/operate payloads still use human **numbers**.

## Reads — GraphQL

| Hook                    | Query                                                |
| ----------------------- | ---------------------------------------------------- |
| `useGraphqlGetEscrow`   | `escrow(contractId)` + financial / deposits / events |
| `useGraphqlListEscrows` | `escrows(...)` (same filters as REST list)           |

Documents: `GRAPHQL_GET_ESCROW`, `GRAPHQL_LIST_ESCROWS`.

```tsx
import {
  useGraphqlGetEscrow,
  useGraphqlListEscrows,
} from "@trustless-work/escrow/hooks/graphql";

const { getEscrow } = useGraphqlGetEscrow();
const { listEscrows } = useGraphqlListEscrows();

const detail = await getEscrow({
  contractId,
  eventsLimit: 20,
});

const page = await listEscrows({
  scope: "mine",
  limit: 20,
});
```

GraphQL wire types (`GraphqlEscrow`, `GraphqlEscrowPage`, …) live on `@trustless-work/escrow` / `@trustless-work/escrow/graphql`.

## Errors

HTTP failures from Core are RFC 9457 Problem Details. The transport surfaces them as `TrustlessWorkApiError`.

```ts
import {
  toTrustlessWorkError,
  TrustlessWorkApiError,
  formatApiErrorMessage,
  ESCROW_ERROR_CODES,
} from "@trustless-work/escrow";

try {
  await fundEscrow(payload, "single-release");
} catch (error: unknown) {
  const err = toTrustlessWorkError(error);
  if (err instanceof TrustlessWorkApiError) {
    // err.code, err.status, err.detail, err.traceId, err.extensions
    toast.error(formatApiErrorMessage(err));
    if (err.code === ESCROW_ERROR_CODES.ESCROW_NOT_FOUND) {
      /* … */
    }
  }
}
```

Also exported: `parseProblemDetails`, `parseProblemDetailsFromAxiosError`, `isProblemDetails`, `isEscrowErrorCode`.

## Types

Import from `@trustless-work/escrow/types` (or the root package):

| Area                 | Examples                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Operate payloads** | `DeploySingleReleaseEscrowPayload`, `FundEscrowPayload`, `ApproveMilestonesPayload`, `AttributionHeaders`, … |
| **Responses**        | `DeployEscrowResponse`, `BuildTransactionResponse`, `SendTransactionResponse`, `ListEscrowsResponse`, …      |
| **Reads**            | `EscrowSummary`, `EscrowAsset`, `EscrowSnapshot`, `EscrowEvent`, `EscrowFinancial`, `KeysetPage`, …          |
| **Entities**         | `Escrow`, `Roles`, `DeployTrustline`, `SingleReleaseMilestone`, …                                            |
| **Errors**           | `ApiProblemDetails`, `EscrowErrorCode`, `ESCROW_ERROR_CODES`                                                 |

## Environment

`development` and `mainNet` currently point at:

`https://beta.api.trustlesswork.com`

Pass any Core API `baseURL` string when you need another host. Get an API key from the Trustless Work dApp.

## Migrating from v3 / v4 → v5

Breaking changes aligned with the Core v2 wire contract:

1. **Removed** legacy helpers: `/helper/get-escrows-by-*`, `/helper/get-escrow-by-contract-ids`, `/helper/get-multiple-escrow-balance` and their hooks.
2. **Use** `useListEscrows` / `useGetEscrow` / `useGetEscrowDetails` / financial & milestones hooks (or GraphQL equivalents).
3. Escrow identity is **`contractId` only** (no UUID).
4. Deploy response includes **`contractId`**: `{ unsignedXdr, txHash, contractId }`.
5. Deploy trustline is `{ contractId, symbol }` (Soroban SAC + asset code).
6. Use `useDeployEscrow` + `Deploy*EscrowPayload` (no `Initialize*` aliases).
7. Milestone ops are **batch** (`useApproveMilestones`, `useChangeMilestoneStatus`, `useManageMilestones`, …).
8. Prefer entry points `@trustless-work/escrow/rest` and `@trustless-work/escrow/graphql` instead of mixing surfaces.

### Read-model notes

1. **`EscrowSummary`** includes root `balance` (string) and `asset { name, address, contractId }`.
2. Read amounts (`balance`, `amount`, financial fields, snapshot amounts) are **decimal strings**. `amount` is the escrow total for both flavors (`null` until the first on-chain projection).
3. **`createdByUserId` / `creatorAddress`** are not on reads (on-chain state is public).
4. Listing uses `scope=mine|all` — not per-escrow access grants.
5. After submit, handle `STELLAR_TX_SUBMITTED_INDEXER_LAGGING` and poll reads; `balance` is eventually consistent.

## License

MIT License — see LICENSE file for details.
