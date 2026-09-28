---
description: REST operate hooks — build unsigned XDR, sign with your wallet, then send.
---

# Operate

Operate hooks call Core **build** endpoints. Each returns an **unsigned** XDR. You sign it, then submit with [`useSendTransaction`](/escrow-react-sdk/usesendtransaction).

Import from `@trustless-work/escrow`, `@trustless-work/escrow/hooks`, or `@trustless-work/escrow/hooks/rest`.

### Hooks

| Hook | Action |
| --- | --- |
| [`useDeployEscrow`](/escrow-react-sdk/escrows/usedeployescrow) | Create escrow (`unsignedXdr` + predicted `contractId`) |
| [`useFundEscrow`](/escrow-react-sdk/escrows/usefundescrow) | Fund |
| [`useUpdateEscrow`](/escrow-react-sdk/escrows/useupdateescrow) | Update properties |
| [`useChangeMilestoneStatus`](/escrow-react-sdk/escrows/usechangemilestonestatus) | Status / evidence (batch) |
| [`useApproveMilestones`](/escrow-react-sdk/escrows/useapprovemilestones) | Approve (batch) |
| [`useApproveAndReleaseMilestones`](/escrow-react-sdk/escrows/useapproveandreleasemilestones) | Approve + release (multi-release) |
| [`useManageMilestones`](/escrow-react-sdk/escrows/usemanagemilestones) | Add / edit milestones |
| [`useReleaseFunds`](/escrow-react-sdk/escrows/usereleasefunds) | Release |
| [`useStartDispute`](/escrow-react-sdk/escrows/usestartdispute) | Start dispute |
| [`useResolveDispute`](/escrow-react-sdk/escrows/useresolvedispute) | Resolve dispute (distributions) |
| [`useWithdrawRemainingFunds`](/escrow-react-sdk/escrows/usewithdrawremainingfunds) | Withdraw remaining |

{% hint style="info" %}
Most operate methods take `(payload, type)` where `type` is `"single-release"` | `"multi-release"`. Multi-only helpers (`approveAndReleaseMilestones`, `releaseMilestones`, `disputeMilestones`) omit the type argument.
{% endhint %}

### Pattern

```tsx
const { unsignedXdr } = await someOperateHook(payload, "single-release");
const signedXdr = await signWithWallet(unsignedXdr);
const result = await sendTransaction(signedXdr);
```

### Response types

| Step | Type |
| --- | --- |
| Deploy build | `DeployEscrowResponse` → `{ unsignedXdr, txHash, contractId }` |
| Other builds | `BuildTransactionResponse` → `{ unsignedXdr, txHash }` |
| Submit | `SendTransactionResponse` |

Error handling: [Errors](/escrow-react-sdk/errors). Payload types: [Types](/escrow-react-sdk/types).
