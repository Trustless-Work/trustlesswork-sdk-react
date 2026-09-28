---
description: Start a dispute on a single-release escrow or selected multi-release milestones.
---

# useStartDispute

Start a dispute. Single-release disputes the whole escrow; multi-release disputes selected milestones.

### Import

```tsx
import { useStartDispute } from "@trustless-work/escrow";
// or
import { useStartDispute } from "@trustless-work/escrow/hooks/rest";
```

### Signature

```ts
function useStartDispute(): {
  startDispute: (
    payload: SingleReleaseStartDisputePayload | MultiReleaseStartDisputePayload,
    type: EscrowType,
  ) => Promise<BuildTransactionResponse>;

  /** Multi-release only — batch dispute milestones. */
  disputeMilestones: (
    payload: MultiReleaseStartDisputePayload,
  ) => Promise<BuildTransactionResponse>;
};
```

| Payload | Fields |
| --- | --- |
| `SingleReleaseStartDisputePayload` | `{ contractId, signer, reason }` |
| `MultiReleaseStartDisputePayload` | `{ contractId, signer, reason, milestoneIndexes }` |

**Returns** `BuildTransactionResponse`: `{ unsignedXdr, txHash }`.

### Single vs multi

{% tabs %}
{% tab title="single-release" %}
```ts
await startDispute(
  { contractId, signer: address, reason: "Scope mismatch" },
  "single-release",
);
```
{% endtab %}

{% tab title="multi-release" %}
```ts
await startDispute(
  { contractId, signer: address, reason: "Late delivery", milestoneIndexes: [1] },
  "multi-release",
);
// or
await disputeMilestones({
  contractId,
  signer: address,
  reason: "Late delivery",
  milestoneIndexes: [1],
});
```
{% endtab %}
{% endtabs %}

### Example

```tsx
import {
  useStartDispute,
  useSendTransaction,
  toTrustlessWorkError,
  TrustlessWorkApiError,
  formatApiErrorMessage,
} from "@trustless-work/escrow";

const { startDispute } = useStartDispute();
const { sendTransaction } = useSendTransaction();

const onDispute = async () => {
  try {
    const { unsignedXdr } = await startDispute(
      { contractId, signer: address, reason: "Quality issues" },
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
