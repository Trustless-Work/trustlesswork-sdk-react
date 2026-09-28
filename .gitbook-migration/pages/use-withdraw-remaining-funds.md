---
description: Withdraw remaining funds using the same distribution shape as resolve dispute.
---

# useWithdrawRemainingFunds

Withdraw remaining funds after release/dispute flows leave a balance.

### Import

```tsx
import { useWithdrawRemainingFunds } from "@trustless-work/escrow";
// or
import { useWithdrawRemainingFunds } from "@trustless-work/escrow/hooks/rest";
```

### Signature

```ts
function useWithdrawRemainingFunds(): {
  withdrawRemainingFunds: (
    payload:
      | SingleReleaseWithdrawRemainingFundsPayload
      | MultiReleaseWithdrawRemainingFundsPayload,
    type: EscrowType,
  ) => Promise<BuildTransactionResponse>;
};
```

Both payload types alias the resolve-dispute shape: `{ contractId, disputeResolver, distributions }` (multi does **not** add `milestoneIndexes` on the TypeScript type — same as single).

**Returns** `BuildTransactionResponse`: `{ unsignedXdr, txHash }`.

### Example

```tsx
import {
  useWithdrawRemainingFunds,
  useSendTransaction,
  toTrustlessWorkError,
  TrustlessWorkApiError,
  formatApiErrorMessage,
} from "@trustless-work/escrow";

const { withdrawRemainingFunds } = useWithdrawRemainingFunds();
const { sendTransaction } = useSendTransaction();

const onWithdraw = async () => {
  try {
    const { unsignedXdr } = await withdrawRemainingFunds(
      {
        contractId,
        disputeResolver: address,
        distributions: [{ address: receiver, amount: 12.5 }],
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
