---
description: Batch-approve one or more milestones for single- or multi-release escrows.
---

# useApproveMilestones

Approve one or more milestones in a single build (v2 batch API).

### Import

```tsx
import { useApproveMilestones } from "@trustless-work/escrow";
// or
import { useApproveMilestones } from "@trustless-work/escrow/hooks/rest";
```

### Signature

```ts
function useApproveMilestones(): {
  approveMilestones: (
    payload: ApproveMilestonesPayload,
    type: EscrowType,
  ) => Promise<BuildTransactionResponse>;
};
```

`ApproveMilestonesPayload`: `{ contractId: string; approver: string; milestoneIndexes: number[] }`.

**Returns** `BuildTransactionResponse`: `{ unsignedXdr, txHash }`.

### Single vs multi

Same payload for both types. Pass `"single-release"` or `"multi-release"`.

{% hint style="info" %}
For multi-release atomic approve + release, use [`useApproveAndReleaseMilestones`](/escrow-react-sdk/escrows/useapproveandreleasemilestones) instead.
{% endhint %}

### Example

```tsx
import {
  useApproveMilestones,
  useSendTransaction,
  toTrustlessWorkError,
  TrustlessWorkApiError,
  formatApiErrorMessage,
} from "@trustless-work/escrow";

const { approveMilestones } = useApproveMilestones();
const { sendTransaction } = useSendTransaction();

const onApprove = async () => {
  try {
    const { unsignedXdr } = await approveMilestones(
      { contractId, approver: address, milestoneIndexes: [0, 1] },
      "single-release",
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
