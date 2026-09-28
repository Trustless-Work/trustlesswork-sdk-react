---
description: RFC 9457 Problem Details — TrustlessWorkApiError and helpers.
---

# Errors

HTTP failures from Core are RFC 9457 Problem Details. The transport surfaces them as `TrustlessWorkApiError`.

### Core exports

```ts
import {
  toTrustlessWorkError,
  TrustlessWorkApiError,
  formatApiErrorMessage,
  parseProblemDetails,
  parseProblemDetailsFromAxiosError,
  isProblemDetails,
  ESCROW_ERROR_CODES,
  isEscrowErrorCode,
} from "@trustless-work/escrow";
```

| Helper | Role |
| --- | --- |
| `toTrustlessWorkError` | Normalize thrown values → `TrustlessWorkApiError` when body is Problem Details |
| `TrustlessWorkApiError` | Typed error with `code`, `status`, `detail`, `traceId`, `extensions`, … |
| `formatApiErrorMessage` | One-liner for toasts/logs (`[CODE] detail (trace: …)`) |
| `parseProblemDetails` | Parse unknown JSON into `ApiProblemDetails` |
| `parseProblemDetailsFromAxiosError` | Extract Problem Details from an Axios error |
| `isProblemDetails` | Type guard |
| `ESCROW_ERROR_CODES` / `isEscrowErrorCode` | Known escrow machine codes |

### Example

```ts
try {
  await fundEscrow(payload, "single-release");
} catch (error: unknown) {
  const err = toTrustlessWorkError(error);
  if (err instanceof TrustlessWorkApiError) {
    // err.code, err.status, err.detail, err.traceId, err.extensions
    toast.error(formatApiErrorMessage(err));
    if (err.code === ESCROW_ERROR_CODES.ESCROW_NOT_FOUND) {
      // handle missing contract
    }
  }
}
```

### `TrustlessWorkApiError` fields

| Accessor | Source |
| --- | --- |
| `status` | HTTP status |
| `code` | Machine-readable code |
| `detail` / `message` | Human detail |
| `traceId` | Correlation id |
| `type` / `title` / `instance` | Problem Details metadata |
| `extensions` | Optional escrow extensions |
| `isEscrowError()` / `asEscrowProblem()` | Narrow to known escrow codes |

{% hint style="info" %}
Operate and read hooks throw the same error class. Always catch as `unknown` and normalize with `toTrustlessWorkError`.
{% endhint %}
