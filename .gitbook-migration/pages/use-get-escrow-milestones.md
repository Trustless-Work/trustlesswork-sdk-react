---
description: Milestones for one escrow (GET /escrows/:contractId/milestones).
---

# useGetEscrowMilestones

Milestones for one escrow (`GET /escrows/:contractId/milestones`).

### Import

```tsx
import { useGetEscrowMilestones } from "@trustless-work/escrow/hooks/rest";
```

### Signature

```ts
function useGetEscrowMilestones(): {
  getEscrowMilestones: (
    contractId: string,
  ) => Promise<GetEscrowMilestonesResponse>;
};
```

`GetEscrowMilestonesResponse` = `EscrowMilestones` (typed milestone list for that contract).

### Example

```tsx
import { useGetEscrowMilestones } from "@trustless-work/escrow/hooks/rest";
import { useQuery } from "@tanstack/react-query";

const { getEscrowMilestones } = useGetEscrowMilestones();

const { data } = useQuery({
  queryKey: ["escrow-milestones", contractId],
  queryFn: () => getEscrowMilestones(contractId),
  enabled: !!contractId,
});
```

For multiple contracts in one call, use [`useGetEscrowsMilestones`](/escrow-react-sdk/indexer/usegetescrowsmilestones).
