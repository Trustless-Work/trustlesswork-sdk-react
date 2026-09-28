---
description: REST read hooks for GET /escrows* — list, detail, events, milestones, financial.
---

# REST Reads

Typed helpers for Core **`GET /escrows*`**. Pair each hook with TanStack Query (or your own cache).

Import from `@trustless-work/escrow`, `@trustless-work/escrow/hooks`, or `@trustless-work/escrow/hooks/rest`.

### Hooks

| Hook | Endpoint |
| --- | --- |
| [`useListEscrows`](/escrow-react-sdk/indexer/uselistescrows) | `GET /escrows` |
| [`useGetEscrow`](/escrow-react-sdk/indexer/usegetescrow) | `GET /escrows/:contractId` |
| [`useGetEscrowDetails`](/escrow-react-sdk/indexer/usegetescrowdetails) | `GET /escrows/details?contractIds=` |
| [`useListEscrowEvents`](/escrow-react-sdk/indexer/uselistescrowevents) | `GET /escrows/:contractId/events` |
| [`useGetEscrowMilestones`](/escrow-react-sdk/indexer/usegetescrowmilestones) | `GET /escrows/:contractId/milestones` |
| [`useGetEscrowsMilestones`](/escrow-react-sdk/indexer/usegetescrowsmilestones) | `GET /escrows/milestones?contractIds=` |
| [`useGetEscrowsFinancial`](/escrow-react-sdk/indexer/usegetescrowsfinancial) | `GET /escrows/financial?contractIds=` |

{% hint style="info" %}
Legacy indexer helpers (`useGetEscrowsFromIndexerBy*`, `useGetMultipleEscrowBalances`, …) were **removed** in v5. Use these REST (or [GraphQL](/escrow-react-sdk/graphql)) hooks instead.
{% endhint %}

### Quick example

```tsx
import { useListEscrows, useGetEscrow } from "@trustless-work/escrow/hooks/rest";
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

### Filters & pagination

`ListEscrowsParams`: `scope`, `status`, `type`, `engagementId`, `contractIds`, `participant`, `role`, `platformId`, `subjectId`, `createdAfter`, `createdBefore`, `includeSnapshot`, `limit`, `cursor`, `sort`, `order`.

* Use `scope: "mine" | "all"` for segmentation (not per-escrow access grants).
* List/events return a **keyset page**: `{ data, hasMore, nextCursor }`.

### Read-model shapes

| Type | Notes |
| --- | --- |
| `EscrowSummary` | List/detail row: `contractId`, `type`, `status`, `balance`, `asset`, camelCased `snapshot` |
| `EscrowDetail` | `{ escrow, events, deposits }` |
| `EscrowFinancial` | Batch financial: deposited / released / pending / `balance` |
| `EscrowEvent` | Indexed event — no UUID event `id` |
| `EscrowDeposit` | Deposit row — no UUID deposit `id` |

Amounts on reads are **human decimal strings**. Prefer GraphQL when you need nested financial + deposits + events in one call — see [GraphQL](/escrow-react-sdk/graphql).
