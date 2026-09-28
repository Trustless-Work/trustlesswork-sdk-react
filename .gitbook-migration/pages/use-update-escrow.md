---
description: Build an unsigned transaction to update on-chain escrow properties.
---

# useUpdateEscrow

Update escrow on-chain properties. Payload shape: `{ contractId, admin, escrow }`.

### Import

```tsx
import { useUpdateEscrow } from "@trustless-work/escrow";
// or
import { useUpdateEscrow } from "@trustless-work/escrow/hooks/rest";
```

### Signature

```ts
function useUpdateEscrow(): {
  updateEscrow: (
    payload: UpdateSingleReleaseEscrowPayload | UpdateMultiReleaseEscrowPayload,
    type: EscrowType,
  ) => Promise<BuildTransactionResponse>;
};
```

**Returns** `BuildTransactionResponse`: `{ unsignedXdr, txHash }`.

### Single vs multi

| Type | Payload | Notes |
| --- | --- | --- |
| `single-release` | `UpdateSingleReleaseEscrowPayload` | `escrow` includes `amount`, `roles: Roles`, single-release milestones |
| `multi-release` | `UpdateMultiReleaseEscrowPayload` | No top-level `amount`; `roles: MultiReleaseRoles`; multi milestones |

### Example

```tsx
import {
  useUpdateEscrow,
  useSendTransaction,
  toTrustlessWorkError,
  TrustlessWorkApiError,
  formatApiErrorMessage,
} from "@trustless-work/escrow";
import type { UpdateSingleReleaseEscrowPayload } from "@trustless-work/escrow/types";

const { updateEscrow } = useUpdateEscrow();
const { sendTransaction } = useSendTransaction();

const onUpdate = async (payload: UpdateSingleReleaseEscrowPayload) => {
  try {
    const { unsignedXdr } = await updateEscrow(payload, "single-release");
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
