---
description: Resolve a dispute by distributing funds to addresses.
---

# useResolveDispute

Resolve a dispute with address → amount distributions.

### Import

```tsx
import { useResolveDispute } from "@trustless-work/escrow";
// or
import { useResolveDispute } from "@trustless-work/escrow/hooks/rest";
```

### Signature

```ts
function useResolveDispute(): {
  resolveDispute: (
    payload:
      | SingleReleaseResolveDisputePayload
      | MultiReleaseResolveDisputePayload,
    type: EscrowType,
  ) => Promise<BuildTransactionResponse>;
};
```

| Payload | Fields |
| --- | --- |
| `SingleReleaseResolveDisputePayload` | `{ contractId, disputeResolver, distributions: Distribution[] }` |
| `MultiReleaseResolveDisputePayload` | Same + `milestoneIndexes: number[]` |

`Distribution`: `{ address: string; amount: number }`.

**Returns** `BuildTransactionResponse`: `{ unsignedXdr, txHash }`.

### Single vs multi

Multi-release requires `milestoneIndexes` for the disputed milestones being resolved.

### Example

```tsx
import {
  useResolveDispute,
  useSendTransaction,
  toTrustlessWorkError,
  TrustlessWorkApiError,
  formatApiErrorMessage,
} from "@trustless-work/escrow";

const { resolveDispute } = useResolveDispute();
const { sendTransaction } = useSendTransaction();

const onResolve = async () => {
  try {
    const { unsignedXdr } = await resolveDispute(
      {
        contractId,
        disputeResolver: address,
        distributions: [
          { address: partyA, amount: 60 },
          { address: partyB, amount: 40 },
        ],
      },
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
