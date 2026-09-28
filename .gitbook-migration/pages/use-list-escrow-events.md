---
description: Paginated event timeline for one escrow (GET /escrows/:contractId/events).
---

# useListEscrowEvents

Paginated escrow event timeline (`GET /escrows/:contractId/events`).

### Import

```tsx
import { useListEscrowEvents } from "@trustless-work/escrow/hooks/rest";
```

### Signature

```ts
function useListEscrowEvents(): {
  listEscrowEvents: (
    contractId: string,
    params?: ListEscrowEventsParams,
  ) => Promise<ListEscrowEventsResponse>;
};
```

`ListEscrowEventsParams`: `{ limit?, order?: "asc" | "desc", cursor? }`.

**Returns** `KeysetPage<EscrowEvent>` → `{ data, hasMore, nextCursor }`.

{% hint style="info" %}
`EscrowEvent` has no UUID event `id`. Use indexer fields (`kind`, `topics`, `payload`, …) as your keys.
{% endhint %}

### Example

```tsx
import { useListEscrowEvents } from "@trustless-work/escrow/hooks/rest";
import { useQuery } from "@tanstack/react-query";

const { listEscrowEvents } = useListEscrowEvents();

const { data } = useQuery({
  queryKey: ["escrow-events", contractId],
  queryFn: () =>
    listEscrowEvents(contractId, { limit: 30, order: "desc" }),
  enabled: !!contractId,
});
```
