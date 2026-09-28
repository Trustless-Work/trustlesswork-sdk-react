---
description: List escrows with keyset pagination and filters (GET /escrows).
---

# useListEscrows

List escrows (`GET /escrows`) with keyset pagination and filters.

### Import

```tsx
import { useListEscrows } from "@trustless-work/escrow/hooks/rest";
```

### Signature

```ts
function useListEscrows(): {
  listEscrows: (params?: ListEscrowsParams) => Promise<ListEscrowsResponse>;
};
```

`ListEscrowsResponse` = `KeysetPage<EscrowSummary>` → `{ data, hasMore, nextCursor }`.

### Params

| Param | Type | Notes |
| --- | --- | --- |
| `scope` | `"mine" \| "all"` | Segmentation (not access grants) |
| `status` | `EscrowStatus` | `active` \| `released` \| `disputed` |
| `type` | `EscrowType` | `single-release` \| `multi-release` (same as the response field) |
| `engagementId` | `string` | |
| `contractIds` | `string[]` | |
| `participant` | `string` | Address |
| `role` | `Role` | |
| `platformId` / `subjectId` | `string` | |
| `createdAfter` / `createdBefore` | `string` | ISO timestamps |
| `limit` | `number` | |
| `cursor` | `string` | Keyset cursor |
| `sort` | `"createdAt" \| "updatedAt"` | |
| `order` | `"asc" \| "desc"` | |

### Example

```tsx
import { useListEscrows } from "@trustless-work/escrow/hooks/rest";
import { useQuery } from "@tanstack/react-query";

const { listEscrows } = useListEscrows();

const { data, isLoading } = useQuery({
  queryKey: ["escrows", "mine", { status: "active" }],
  queryFn: () =>
    listEscrows({
      scope: "mine",
      status: "active",
      limit: 20,
      sort: "createdAt",
      order: "desc",
    }),
});

// data?.data → EscrowSummary[]
// data?.hasMore / data?.nextCursor → load more
```
