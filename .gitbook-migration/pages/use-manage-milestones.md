---
description: Add new milestones or update existing ones (description / amount).
---

# useManageMilestones

Add or update milestones. Payload: `{ contractId, admin, newMilestones[], milestoneUpdates[] }`.

### Import

```tsx
import { useManageMilestones } from "@trustless-work/escrow";
// or
import { useManageMilestones } from "@trustless-work/escrow/hooks/rest";
```

### Signature

```ts
function useManageMilestones(): {
  manageMilestones: (
    payload:
      | ManageSingleReleaseMilestonesPayload
      | ManageMultiReleaseMilestonesPayload,
    type: EscrowType,
  ) => Promise<BuildTransactionResponse>;
};
```

**Returns** `BuildTransactionResponse`: `{ unsignedXdr, txHash }`.

### Single vs multi

{% tabs %}
{% tab title="single-release" %}
* `newMilestones`: `SingleReleaseMilestonePayload[]` (`description`, `approvalsTarget`, optional `status`)
* `milestoneUpdates`: `{ index, newDescription? }[]`
{% endtab %}

{% tab title="multi-release" %}
* `newMilestones`: `MultiReleaseMilestonePayload[]` (adds `amount`, `receiver`)
* `milestoneUpdates`: `{ index, newDescription?, newAmount? }[]`
{% endtab %}
{% endtabs %}

### Example

```tsx
import {
  useManageMilestones,
  useSendTransaction,
  toTrustlessWorkError,
  TrustlessWorkApiError,
  formatApiErrorMessage,
} from "@trustless-work/escrow";

const { manageMilestones } = useManageMilestones();
const { sendTransaction } = useSendTransaction();

const onManage = async () => {
  try {
    const { unsignedXdr } = await manageMilestones(
      {
        contractId,
        admin: address,
        newMilestones: [
          { description: "QA pass", approvalsTarget: 1, amount: 50, receiver },
        ],
        milestoneUpdates: [{ index: 0, newDescription: "Updated scope" }],
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
