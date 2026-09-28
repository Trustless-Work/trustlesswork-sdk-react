---
description: Entry points, client layers, and the build → sign → send flow.
---

# Architecture

### Package entry points

| Import | Contains |
| --- | --- |
| `@trustless-work/escrow` | Config, client, REST + GraphQL hooks, types, errors |
| `@trustless-work/escrow/rest` | `EscrowRestService` + REST hooks only |
| `@trustless-work/escrow/graphql` | GraphQL service, documents, GraphQL hooks |
| `@trustless-work/escrow/hooks` | All hooks (REST + GraphQL) |
| `@trustless-work/escrow/hooks/rest` | REST hooks only |
| `@trustless-work/escrow/hooks/graphql` | GraphQL hooks only |
| `@trustless-work/escrow/types` | Payloads, responses, read-model, entities |

```tsx
import { useEscrowRest, useEscrowGraphql } from "@trustless-work/escrow";
import { useGraphqlGetEscrow } from "@trustless-work/escrow/hooks/graphql";

const rest = useEscrowRest();       // operate + GET /escrows*
const graphql = useEscrowGraphql(); // POST /graphql
const { getEscrow } = useGraphqlGetEscrow();
```

### Layers

```
TrustlessWorkConfig
  └─ TrustlessWorkClient
       ├─ EscrowRestService   (operate builds + REST reads)
       └─ EscrowGraphqlService (POST /graphql)
```

Hooks are thin wrappers: they call `useEscrowRest()` / `useEscrowGraphql()` from context and return named functions. Pair read hooks with TanStack Query (or similar); operate hooks return unsigned XDR only.

### Build → sign → send

Every mutate hook returns an **unsigned** transaction. You sign with the wallet, then submit via [`useSendTransaction`](/escrow-react-sdk/usesendtransaction).

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
      // optional: { platformId, subjectId }
    );

    const signedXdr = await signWithWallet(unsignedXdr);
    const result = await sendTransaction(signedXdr);

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

### Operate response shapes

| Step | Type | Shape |
| --- | --- | --- |
| Deploy build | `DeployEscrowResponse` | `{ unsignedXdr, txHash, contractId }` |
| Other builds | `BuildTransactionResponse` | `{ unsignedXdr, txHash }` |
| Submit | `SendTransactionResponse` | `{ txHash, ledger, contractId?, escrow?, code?, message? }` |

`code` may be `STELLAR_TX_SUBMITTED` or `STELLAR_TX_SUBMITTED_INDEXER_LAGGING`.

### Identity & amounts

* Escrow identity is **`contractId` only** (no UUID `id` / `escrowId`).
* Deploy trustline: `{ contractId, symbol }` (Soroban SAC `C…` + asset code).
* Read amounts are **decimal strings**; operate payloads use **numbers**.

See [Types](/escrow-react-sdk/types) and [Errors](/escrow-react-sdk/errors) for the full catalog.
