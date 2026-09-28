---
description: Build an unsigned deploy transaction for a new single- or multi-release escrow.
---

# useDeployEscrow

Build an unsigned deploy transaction for a new v2 escrow. Returns `unsignedXdr` plus the predicted `contractId`.

### Import

```tsx
import { useDeployEscrow } from "@trustless-work/escrow";
// or
import { useDeployEscrow } from "@trustless-work/escrow/hooks/rest";
```

### Signature

```ts
function useDeployEscrow(): {
  deployEscrow: (
    payload: DeploySingleReleaseEscrowPayload | DeployMultiReleaseEscrowPayload,
    type: EscrowType,
    attribution?: AttributionHeaders,
  ) => Promise<DeployEscrowResponse>;
};
```

**Returns** `DeployEscrowResponse`: `{ unsignedXdr, txHash, contractId }`.

### Single vs multi

{% tabs %}
{% tab title="single-release" %}
`DeploySingleReleaseEscrowPayload`: `signer`, `engagementId`, `title`, `description`, `amount`, `platformFee`, `roles` (`Roles`), `milestones` (`SingleReleaseMilestonePayload[]`), `trustline` (`DeployTrustline`).

```ts
await deployEscrow(payload, "single-release");
```
{% endtab %}

{% tab title="multi-release" %}
`DeployMultiReleaseEscrowPayload`: same fields except no top-level `amount`; `roles` is `MultiReleaseRoles`; each milestone includes `amount` + `receiver`.

```ts
await deployEscrow(payload, "multi-release");
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
Deploy trustline shape: `{ contractId, symbol }` (Soroban SAC `C…` + asset code). Optional `attribution` maps to `X-TW-Platform` / `X-TW-Subject`.
{% endhint %}

### Example

```tsx
import {
  useDeployEscrow,
  useSendTransaction,
  toTrustlessWorkError,
  TrustlessWorkApiError,
  formatApiErrorMessage,
} from "@trustless-work/escrow";
import type { DeploySingleReleaseEscrowPayload } from "@trustless-work/escrow/types";

const { deployEscrow } = useDeployEscrow();
const { sendTransaction } = useSendTransaction();

const onDeploy = async (payload: DeploySingleReleaseEscrowPayload) => {
  try {
    const { unsignedXdr, contractId } = await deployEscrow(
      payload,
      "single-release",
      { platformId, subjectId },
    );
    const signedXdr = await signWithWallet(unsignedXdr);
    const result = await sendTransaction(signedXdr);
    // Prefer predicted contractId; result.contractId may also appear on confirm
    return { contractId, txHash: result.txHash };
  } catch (error: unknown) {
    const err = toTrustlessWorkError(error);
    if (err instanceof TrustlessWorkApiError) {
      toast.error(formatApiErrorMessage(err));
    }
    throw error;
  }
};
```

{% hint style="warning" %}
There is no `useInitializeEscrow` in v5. Use `useDeployEscrow` + `Deploy*EscrowPayload`.
{% endhint %}
