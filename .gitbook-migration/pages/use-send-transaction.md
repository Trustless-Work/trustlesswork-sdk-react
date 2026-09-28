---
description: Submit a signed Stellar XDR via POST /stellar/send-transaction.
---

# useSendTransaction

Submit a **signed** transaction XDR to Core. Call this after any operate hook returns `unsignedXdr` and your wallet has signed it.

### Import

```tsx
import { useSendTransaction } from "@trustless-work/escrow";
// or
import { useSendTransaction } from "@trustless-work/escrow/hooks/rest";
```

### Signature

```ts
function useSendTransaction(): {
  sendTransaction: (signedXdr: string) => Promise<SendTransactionResponse>;
};
```

**Returns** `SendTransactionResponse`:

| Field | Type | Notes |
| --- | --- | --- |
| `txHash` | `string` | On-chain transaction hash |
| `ledger` | `number` | Ledger number |
| `contractId?` | `string` | Present on factory deploy confirmation |
| `escrow?` | `Escrow \| EscrowSummary` | Optional snapshot after submit |
| `code?` | `SendTransactionCode` | `STELLAR_TX_SUBMITTED` or `STELLAR_TX_SUBMITTED_INDEXER_LAGGING` |
| `message?` | `string` | Human-readable note |

{% hint style="warning" %}
When `code` is `STELLAR_TX_SUBMITTED_INDEXER_LAGGING`, the tx is on-chain but reads may lag. Poll [`useGetEscrow`](/escrow-react-sdk/indexer/usegetescrow) until the indexer catches up.
{% endhint %}

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
      { contractId, amount: 100, signer: address },
      "single-release",
    );
    const signedXdr = await signWithWallet(unsignedXdr);
    const result = await sendTransaction(signedXdr);
    console.log(result.txHash, result.code);
  } catch (error: unknown) {
    const err = toTrustlessWorkError(error);
    if (err instanceof TrustlessWorkApiError) {
      toast.error(formatApiErrorMessage(err));
    }
    throw error;
  }
};
```

See [Operate](/escrow-react-sdk/escrows) for the full mutate catalog.
