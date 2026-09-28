---
description: Batch financial summaries (GET /escrows/financial).
---

# useGetEscrowsFinancial

Batch financial summaries (`GET /escrows/financial`).

### Import

```tsx
import { useGetEscrowsFinancial } from "@trustless-work/escrow/hooks/rest";
```

### Signature

```ts
function useGetEscrowsFinancial(): {
  getEscrowsFinancial: (
    params: BatchContractIdsParams | string[],
  ) => Promise<BatchEscrowFinancialResponse>;
};
```

Accepts `{ contractIds: string[] }` or a bare `string[]`.

**Returns** `{ data: EscrowFinancial[] }` — deposited / released / pending / `balance` (decimal strings).

### Example

```tsx
import { useGetEscrowsFinancial } from "@trustless-work/escrow/hooks/rest";
import { useQuery } from "@tanstack/react-query";

const { getEscrowsFinancial } = useGetEscrowsFinancial();

const { data } = useQuery({
  queryKey: ["escrows-financial", contractIds],
  queryFn: () => getEscrowsFinancial(contractIds),
  enabled: contractIds.length > 0,
});

// data?.data[0].balance → "250.5" (do not divide by 1e7)
```
