---
description: Breaking changes when migrating from @trustless-work/escrow v3/v4 to v5.
---

# Migration (v3 / v4 → v5)

Breaking changes aligned with the Core v2 wire contract.

### Checklist

{% stepper %}
{% step %}
**Remove legacy indexer helpers**

Deleted endpoints and hooks:

- `/helper/get-escrows-by-*`
- `/helper/get-escrow-by-contract-ids`
- `/helper/get-multiple-escrow-balance`
- Hooks: `useGetEscrowsFromIndexerBySigner`, `useGetEscrowsFromIndexerByRole`, `useGetEscrowFromIndexerByContractIds`, `useGetMultipleEscrowBalances`
  {% endstep %}

{% step %}
**Use REST or GraphQL reads**

- [`useListEscrows`](/escrow-react-sdk/indexer/uselistescrows) / [`useGetEscrow`](/escrow-react-sdk/indexer/usegetescrow) / [`useGetEscrowDetails`](/escrow-react-sdk/indexer/usegetescrowdetails)
- Financial & milestones hooks under [REST Reads](/escrow-react-sdk/indexer)
- Or [GraphQL](/escrow-react-sdk/graphql) equivalents
  {% endstep %}

{% step %}
**Adopt `contractId` identity**

Escrow identity is **`contractId` only** (no UUID). Deploy response includes predicted `contractId`: `{ unsignedXdr, txHash, contractId }`.
{% endstep %}

{% step %}
**Rename deploy APIs**

- Use `useDeployEscrow` + `Deploy*EscrowPayload` (no `Initialize*` / `useInitializeEscrow` aliases)
- Deploy trustline is `{ contractId, symbol }` (Soroban SAC + asset code)
  {% endstep %}

{% step %}
**Batch milestone ops**

Use `useApproveMilestones`, `useChangeMilestoneStatus`, `useManageMilestones`, `useApproveAndReleaseMilestones`, etc. — not single-milestone-only legacy shapes.
{% endstep %}

{% step %}
**Prefer split entry points**

`@trustless-work/escrow/rest` and `@trustless-work/escrow/graphql` instead of mixing surfaces.
{% endstep %}
{% endstepper %}

### Read-model notes

1. **`EscrowSummary`** includes root `balance` (string) and `asset { name, address, contractId }`.
2. Read amounts (`balance`, `amount`, financial fields, snapshot amounts) are **decimal strings** — do **not** divide by `1e7`. `amount` is the escrow total for both flavors (`null` until the first on-chain projection).
3. **`createdByUserId` / `creatorAddress`** are not on reads (on-chain state is public).
4. Listing uses `scope=mine|all` — not per-escrow access grants.
5. After submit, handle `STELLAR_TX_SUBMITTED_INDEXER_LAGGING` and poll reads; `balance` is eventually consistent.

### Environment

`development` and `mainNet` currently both point at:

```
https://beta.api.trustlesswork.com
```

See [Getting Started](/escrow-react-sdk/getting-started) and [Architecture](/escrow-react-sdk/architecture).
