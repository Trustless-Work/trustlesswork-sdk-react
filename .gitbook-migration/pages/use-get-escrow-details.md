---
description: Batch escrow details for multiple contractIds (GET /escrows/details).
---

# useGetEscrowDetails

Batch escrow details (`GET /escrows/details`).

### Import

```tsx
import { useGetEscrowDetails } from "@trustless-work/escrow/hooks/rest";
```

### Signature

```ts
function useGetEscrowDetails(): {
  getEscrowDetails: (
    params: BatchContractIdsParams | string[],
  ) => Promise<BatchEscrowDetailsResponse>;
};
```

Accepts `{ contractIds: string[] }` or a bare `string[]`.

**Returns** `{ data: EscrowDetailsItem[] }`.

### Example

```tsx
import { useGetEscrowDetails } from "@trustless-work/escrow/hooks/rest";
import { useQuery } from "@tanstack/react-query";

const { getEscrowDetails } = useGetEscrowDetails();

const { data } = useQuery({
  queryKey: ["escrow-details", contractIds],
  queryFn: () => getEscrowDetails({ contractIds }),
  enabled: contractIds.length > 0,
});

// or: getEscrowDetails(contractIds)
```
