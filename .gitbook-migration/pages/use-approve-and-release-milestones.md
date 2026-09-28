---
description: Multi-release only — atomic approve and release for given milestone indexes.
---

# useApproveAndReleaseMilestones

**Multi-release only.** Atomic approve + release for the given milestone indexes.

`signer` must be in both `roles.approvers` and `roles.releaseSigners`.

### Import

```tsx
import { useApproveAndReleaseMilestones } from "@trustless-work/escrow";
// or
import { useApproveAndReleaseMilestones } from "@trustless-work/escrow/hooks/rest";
```

### Signature

```ts
function useApproveAndReleaseMilestones(): {
  approveAndReleaseMilestones: (
    payload: ApproveAndReleaseMilestonesPayload,
  ) => Promise<BuildTransactionResponse>;
};
```

`ApproveAndReleaseMilestonesPayload`: `{ contractId: string; signer: string; milestoneIndexes: number[] }`.

No `EscrowType` argument — this hook is multi-release only.

**Returns** `BuildTransactionResponse`: `{ unsignedXdr, txHash }`.

### Example

```tsx
import {
  useApproveAndReleaseMilestones,
  useSendTransaction,
  toTrustlessWorkError,
  TrustlessWorkApiError,
  formatApiErrorMessage,
} from "@trustless-work/escrow";

const { approveAndReleaseMilestones } = useApproveAndReleaseMilestones();
const { sendTransaction } = useSendTransaction();

const onApproveAndRelease = async () => {
  try {
    const { unsignedXdr } = await approveAndReleaseMilestones({
      contractId,
      signer: address,
      milestoneIndexes: [0],
    });
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
