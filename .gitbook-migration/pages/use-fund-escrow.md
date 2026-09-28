---
description: Build an unsigned transaction to fund an escrow.
---

# useFundEscrow

Fund an existing escrow by `contractId`.

### Import

```tsx
import { useFundEscrow } from "@trustless-work/escrow";
// or
import { useFundEscrow } from "@trustless-work/escrow/hooks/rest";
```

### Signature

```ts
function useFundEscrow(): {
  fundEscrow: (
    payload: FundEscrowPayload,
    type: EscrowType,
  ) => Promise<BuildTransactionResponse>;
};
```

`FundEscrowPayload`: `{ amount: number; contractId: string; signer: string }`.

**Returns** `BuildTransactionResponse`: `{ unsignedXdr, txHash }`.

### Single vs multi

Pass `"single-release"` or `"multi-release"` as `type`. The payload shape is the same for both.

### Example

```tsx
import {
  useFundEscrow,
  useSendTransaction,
  toTrustlessWorkError,
  TrustlessWorkApiError,
  formatApiErrorMessage,
} from "@trustless-work/escrow";

const { fundEscrow } = useFundEscrow();
const { sendTransaction } = useSendTransaction();

const onFund = async () => {
  try {
    const { unsignedXdr } = await fundEscrow(
      { contractId, amount: 250.5, signer: address },
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
