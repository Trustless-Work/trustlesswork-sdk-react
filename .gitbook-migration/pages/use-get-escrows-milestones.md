---
description: Batch milestones for multiple contractIds (GET /escrows/milestones).
---

# useGetEscrowsMilestones

Batch milestones (`GET /escrows/milestones`).

### Import

```tsx
import { useGetEscrowsMilestones } from "@trustless-work/escrow/hooks/rest";
```

### Signature

```ts
function useGetEscrowsMilestones(): {
  getEscrowsMilestones: (
    params: BatchContractIdsParams | string[],
  ) => Promise<BatchEscrowMilestonesResponse>;
};
```

Accepts `{ contractIds: string[] }` or a bare `string[]`.

**Returns** `{ data: EscrowMilestones[] }`.

### Example

```tsx
import { useGetEscrowsMilestones } from "@trustless-work/escrow/hooks/rest";
import { useQuery } from "@tanstack/react-query";

const { getEscrowsMilestones } = useGetEscrowsMilestones();

const { data } = useQuery({
  queryKey: ["escrows-milestones", contractIds],
  queryFn: () => getEscrowsMilestones({ contractIds }),
  enabled: contractIds.length > 0,
});
```
