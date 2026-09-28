---
description: Release funds — whole escrow (single) or batch milestones (multi).
---

# useReleaseFunds

Release funds. Single-release releases the whole escrow; multi-release releases via `milestoneIndexes[]`.

### Import

```tsx
import { useReleaseFunds } from "@trustless-work/escrow";
// or
import { useReleaseFunds } from "@trustless-work/escrow/hooks/rest";
```

### Signature

```ts
function useReleaseFunds(): {
  releaseFunds: (
    payload: SingleReleaseReleaseFundsPayload | MultiReleaseReleaseFundsPayload,
    type: EscrowType,
  ) => Promise<BuildTransactionResponse>;

  /** Multi-release only — batch release milestones. */
  releaseMilestones: (
    payload: MultiReleaseReleaseFundsPayload,
  ) => Promise<BuildTransactionResponse>;
};
```

| Payload | Fields |
| --- | --- |
| `SingleReleaseReleaseFundsPayload` | `{ contractId, releaseSigner }` |
| `MultiReleaseReleaseFundsPayload` | `{ contractId, releaseSigner, milestoneIndexes }` |

**Returns** `BuildTransactionResponse`: `{ unsignedXdr, txHash }`.

### Single vs multi

{% tabs %}
{% tab title="single-release" %}
```ts
await releaseFunds({ contractId, releaseSigner: address }, "single-release");
```
{% endtab %}

{% tab title="multi-release" %}
```ts
await releaseFunds(
  { contractId, releaseSigner: address, milestoneIndexes: [0, 1] },
  "multi-release",
);
// or
await releaseMilestones({
  contractId,
  releaseSigner: address,
  milestoneIndexes: [0, 1],
});
```
{% endtab %}
{% endtabs %}

### Example

```tsx
import {
  useReleaseFunds,
  useSendTransaction,
  toTrustlessWorkError,
  TrustlessWorkApiError,
  formatApiErrorMessage,
} from "@trustless-work/escrow";

const { releaseFunds } = useReleaseFunds();
const { sendTransaction } = useSendTransaction();

const onRelease = async () => {
  try {
    const { unsignedXdr } = await releaseFunds(
      { contractId, releaseSigner: address },
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
