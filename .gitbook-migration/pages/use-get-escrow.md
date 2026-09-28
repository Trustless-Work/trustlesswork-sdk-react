---
description: Fetch a single escrow detail by contractId (GET /escrows/:contractId).
---

# useGetEscrow

Get a single escrow detail (`GET /escrows/:contractId`).

### Import

```tsx
import { useGetEscrow } from "@trustless-work/escrow/hooks/rest";
```

### Signature

```ts
function useGetEscrow(): {
  getEscrow: (contractId: string) => Promise<GetEscrowResponse>;
};
```

`GetEscrowResponse` = `EscrowDetail` → `{ escrow, events, deposits }`.

### Example

```tsx
import { useGetEscrow } from "@trustless-work/escrow/hooks/rest";
import { useQuery } from "@tanstack/react-query";

const { getEscrow } = useGetEscrow();

const { data } = useQuery({
  queryKey: ["escrow", contractId],
  queryFn: () => getEscrow(contractId),
  enabled: !!contractId,
});

// data?.escrow → EscrowSummary
// data?.events / data?.deposits
```

{% hint style="info" %}
After submit with `STELLAR_TX_SUBMITTED_INDEXER_LAGGING`, poll this endpoint until the indexer catches up. `balance` is eventually consistent.
{% endhint %}
