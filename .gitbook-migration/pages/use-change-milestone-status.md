---
description: Batch-change milestone status and optional evidence for single- or multi-release escrows.
---

# useChangeMilestoneStatus

Batch change milestone status (and optional evidence). Works for both escrow types.

### Import

```tsx
import { useChangeMilestoneStatus } from "@trustless-work/escrow";
// or
import { useChangeMilestoneStatus } from "@trustless-work/escrow/hooks/rest";
```

### Signature

```ts
function useChangeMilestoneStatus(): {
  changeMilestoneStatus: (
    payload: ChangeMilestoneStatusPayload,
    type: EscrowType,
  ) => Promise<BuildTransactionResponse>;
};
```

`ChangeMilestoneStatusPayload`:

```ts
{
  contractId: string;
  serviceProvider: string;
  updates: Array<{
    index: number;
    newStatus: string;
    newEvidence?: string;
  }>;
}
```

**Returns** `BuildTransactionResponse`: `{ unsignedXdr, txHash }`.

### Single vs multi

Same payload and batch API for both types — pass the matching `EscrowType`.

### Example

```tsx
import {
  useChangeMilestoneStatus,
  useSendTransaction,
  toTrustlessWorkError,
  TrustlessWorkApiError,
  formatApiErrorMessage,
} from "@trustless-work/escrow";

const { changeMilestoneStatus } = useChangeMilestoneStatus();
const { sendTransaction } = useSendTransaction();

const onChangeStatus = async () => {
  try {
    const { unsignedXdr } = await changeMilestoneStatus(
      {
        contractId,
        serviceProvider: address,
        updates: [
          { index: 0, newStatus: "Completed", newEvidence: "https://…" },
        ],
      },
      "multi-release",
    );
    const signedXdr = await signWithWallet(unsignedXdr);
    return await sendTransaction(signedXdr);
  } catch (error: unknown) {
    const err = toTrustlessWorkError(error);
    if (err instanceof TrustlessWorkApiError) {
      toast.error(formatApiErrorMessage(err));
    }
    throw error;
  }
};
```
