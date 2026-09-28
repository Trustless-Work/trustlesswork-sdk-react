---
description: Plain shapes for the most important `@trustless-work/escrow` types — entities, payloads, responses, and the read model.
---

# Types

All types below ship with `@trustless-work/escrow`. Import them from the package root or from `@trustless-work/escrow/types`.

```ts
import type {
  DeploySingleReleaseEscrowPayload,
  EscrowSummary,
  Roles,
} from "@trustless-work/escrow";
```

{% hint style="info" %}
**Three buckets**

1. **Entities** — on-chain / deploy shapes (roles, milestones, escrow).
2. **Payloads** — what you send to operate hooks / REST (deploy, fund, release, …).
3. **Reads & responses** — what the Core API returns after build, submit, or GET.
{% endhint %}

{% hint style="warning" %}
**Amounts**

- **Operate payloads** use human **numbers** (`amount: 1000`).
- **Read-model** fields use **decimal strings** (`balance: "1000"`, `amount: "250"`).

There is no UUID `id` / `escrowId`. Always identify an escrow with `contractId` (`C…`).
{% endhint %}

---

## Core values

```ts
type EscrowType = "single-release" | "multi-release";

type EscrowStatus = "active" | "released" | "disputed";

type EscrowNetwork = string; // e.g. network id from Core

type baseURL = string; // Core API base URL
```

| Value | Meaning |
| --- | --- |
| `single-release` | One payout for the whole escrow after milestones are done |
| `multi-release` | Each milestone can be released on its own |
| `active` / `released` / `disputed` | Derived status on list/detail rows |

---

## Roles

v2 roles use **arrays** for operational wallets. Single-release keeps an escrow-level `receiver`. Multi-release puts `receiver` on each milestone instead.

### Single-release — `Roles`

```ts
type Roles = {
  approvers: string[];        // G… wallets that approve milestones
  serviceProviders: string[]; // who delivers work / updates status
  platform: string;           // platform fee address
  releaseSigners: string[];   // who can release funds
  disputeResolvers: string[]; // who can resolve disputes
  receiver: string;           // who receives the single payout
  admin: string;              // who can update / manage milestones
  observers?: string[];       // optional watchers
};
```

### Multi-release — `MultiReleaseRoles`

Same as `Roles`, **without** `receiver` (each milestone has its own):

```ts
type MultiReleaseRoles = {
  approvers: string[];
  serviceProviders: string[];
  platform: string;
  releaseSigners: string[];
  disputeResolvers: string[];
  admin: string;
  observers?: string[];
};
```

### Role filter — `Role`

Used when filtering lists (`ListEscrowsParams.role`):

```ts
type Role =
  | "approver"
  | "serviceProvider"
  | "platform"
  | "releaseSigner"
  | "disputeResolver"
  | "receiver"
  | "admin"
  | "observer"
  | "signer";
```

---

## Trustline

### On deploy — `DeployTrustline`

```ts
type DeployTrustline = {
  contractId: string; // Soroban SAC contract id (C…)
  symbol: string;     // e.g. "USDC"
};
```

### On read / snapshot — `Trustline`

```ts
type Trustline = {
  address: string;     // issuer or related address
  symbol?: string;
  contractId?: string; // SAC id when present
};
```

---

## Milestones

### Approvals — `MilestoneApprovals`

```ts
type MilestoneApprovals = {
  target: number;         // how many approvals are required
  approvalCount: number;  // how many have approved so far
  approvedBy: string[];   // G… wallets that already approved
};
```

### Single-release milestone — `SingleReleaseMilestone`

```ts
type SingleReleaseMilestone = {
  description: string;
  status?: string;           // free-form status label
  evidence?: string;         // optional proof / link
  approvalsTarget?: number;
  approvals?: MilestoneApprovals;
};
```

### Multi-release milestone — `MultiReleaseMilestone`

```ts
type MultiReleaseMilestone = {
  description: string;
  amount: number;            // payout for this milestone
  receiver: string;          // G… who receives this milestone
  status?: string;
  evidence?: string;
  approvalsTarget?: number;
  approvals?: MilestoneApprovals;
  released?: boolean;
  dispute?: {
    isDisputed: boolean;
    reason: string;
    resolved: boolean;
  };
};
```

### Escrow-level dispute (single-release) — `Dispute`

```ts
type Dispute = {
  isDisputed: boolean;
  reason: string;
  resolved: boolean;
};
```

---

## Escrow entities

These are the **on-chain / post-submit** shapes (also used inside some send-transaction responses). Prefer the **read model** (`EscrowSummary`) for list/detail UI.

{% tabs %}
{% tab title="Single-release" %}
```ts
type SingleReleaseEscrow = {
  type: "single-release";
  contractId: string;
  contractBaseId?: string;
  signer: string;
  engagementId: string;
  title: string;
  description: string;
  platformFee: number;
  balance: number;
  amount: number;
  transactionHash?: string | null;
  trustline: Trustline;
  roles: Roles;
  milestones: SingleReleaseMilestone[];
  dispute?: Dispute;
  released?: boolean;
};
```
{% endtab %}

{% tab title="Multi-release" %}
```ts
type MultiReleaseEscrow = {
  type: "multi-release";
  contractId: string;
  contractBaseId?: string;
  signer: string;
  engagementId: string;
  title: string;
  description: string;
  platformFee: number;
  balance: number;
  transactionHash?: string | null;
  trustline: Trustline;
  roles: MultiReleaseRoles;
  milestones: MultiReleaseMilestone[];
};
```

{% hint style="info" %}
There is **no escrow-level `amount`**. Total value is the sum of milestone `amount`s.
{% endhint %}
{% endtab %}
{% endtabs %}

`Escrow` is either single or multi:

```ts
type Escrow = SingleReleaseEscrow | MultiReleaseEscrow;
```

---

## Payloads (operate)

What you pass into deploy / update / fund / release / dispute hooks. Milestone **payloads** for deploy are leaner than full entity milestones.

### Milestone payloads (deploy / manage)

```ts
type SingleReleaseMilestonePayload = {
  description: string;
  status?: string;
  approvalsTarget: number;
};

type MultiReleaseMilestonePayload = {
  description: string;
  status?: string;
  approvalsTarget: number;
  amount: number;
  receiver: string;
};
```

### Deploy

{% tabs %}
{% tab title="Single-release" %}
```ts
type DeploySingleReleaseEscrowPayload = {
  signer: string;
  engagementId: string;
  title: string;
  description: string;
  amount: number;
  platformFee: number;
  roles: Roles;
  milestones: SingleReleaseMilestonePayload[];
  trustline: DeployTrustline;
};
```
{% endtab %}

{% tab title="Multi-release" %}
```ts
type DeployMultiReleaseEscrowPayload = {
  signer: string;
  engagementId: string;
  title: string;
  description: string;
  platformFee: number;
  roles: MultiReleaseRoles;
  milestones: MultiReleaseMilestonePayload[];
  trustline: DeployTrustline;
};
```
{% endtab %}
{% endtabs %}

Optional attribution headers (platform-scoped calls):

```ts
type AttributionHeaders = {
  platformId?: string; // → X-TW-Platform
  subjectId?: string;  // → X-TW-Subject
};
```

### Update (full replace)

```ts
type UpdateSingleReleaseEscrowPayload = {
  contractId: string;
  admin: string;
  escrow: {
    engagementId: string;
    title: string;
    description: string;
    amount: number;
    platformFee: number;
    roles: Roles;
    milestones: SingleReleaseMilestonePayload[];
    trustline: Trustline;
  };
};

type UpdateMultiReleaseEscrowPayload = {
  contractId: string;
  admin: string;
  escrow: {
    engagementId: string;
    title: string;
    description: string;
    platformFee: number;
    roles: MultiReleaseRoles;
    milestones: MultiReleaseMilestonePayload[];
    trustline: Trustline;
  };
};
```

### Fund

```ts
type FundEscrowPayload = {
  amount: number;
  contractId: string;
  signer: string;
};
```

### Change milestone status

```ts
type ChangeMilestoneStatusPayload = {
  contractId: string;
  serviceProvider: string;
  updates: Array<{
    index: number;
    newStatus: string;
    newEvidence?: string;
  }>;
};
```

### Approve milestones

```ts
type ApproveMilestonesPayload = {
  contractId: string;
  approver: string;
  milestoneIndexes: number[];
};
```

### Approve and release (multi convenience)

```ts
type ApproveAndReleaseMilestonesPayload = {
  contractId: string;
  signer: string;
  milestoneIndexes: number[];
};
```

### Manage milestones (add / edit descriptions)

```ts
type ManageSingleReleaseMilestonesPayload = {
  contractId: string;
  admin: string;
  newMilestones: SingleReleaseMilestonePayload[];
  milestoneUpdates: Array<{
    index: number;
    newDescription?: string;
  }>;
};

type ManageMultiReleaseMilestonesPayload = {
  contractId: string;
  admin: string;
  newMilestones: MultiReleaseMilestonePayload[];
  milestoneUpdates: Array<{
    index: number;
    newDescription?: string;
    newAmount?: number;
  }>;
};
```

### Release funds

{% tabs %}
{% tab title="Single-release" %}
```ts
type SingleReleaseReleaseFundsPayload = {
  contractId: string;
  releaseSigner: string;
};
```
{% endtab %}

{% tab title="Multi-release" %}
```ts
type MultiReleaseReleaseFundsPayload = {
  contractId: string;
  releaseSigner: string;
  milestoneIndexes: number[];
};
```
{% endtab %}
{% endtabs %}

### Start dispute

{% tabs %}
{% tab title="Single-release" %}
```ts
type SingleReleaseStartDisputePayload = {
  contractId: string;
  signer: string;
  reason: string;
};
```
{% endtab %}

{% tab title="Multi-release" %}
```ts
type MultiReleaseStartDisputePayload = {
  contractId: string;
  signer: string;
  reason: string;
  milestoneIndexes: number[];
};
```
{% endtab %}
{% endtabs %}

### Resolve dispute / withdraw remaining

Shared distribution entry:

```ts
type Distribution = {
  address: string;
  amount: number;
};
```

{% tabs %}
{% tab title="Resolve — single" %}
```ts
type SingleReleaseResolveDisputePayload = {
  contractId: string;
  disputeResolver: string;
  distributions: Distribution[];
};
```
{% endtab %}

{% tab title="Resolve — multi" %}
```ts
type MultiReleaseResolveDisputePayload = {
  contractId: string;
  disputeResolver: string;
  distributions: Distribution[];
  milestoneIndexes: number[];
};
```
{% endtab %}

{% tab title="Withdraw remaining" %}
```ts
// Same shape as resolve (single). Multi uses the same fields without milestoneIndexes.
type SingleReleaseWithdrawRemainingFundsPayload = {
  contractId: string;
  disputeResolver: string;
  distributions: Distribution[];
};

type MultiReleaseWithdrawRemainingFundsPayload = {
  contractId: string;
  disputeResolver: string;
  distributions: Distribution[];
};
```
{% endtab %}
{% endtabs %}

---

## Transaction responses

Returned by **build** (unsigned XDR) and **send** (after wallet signs).

```ts
type BuildTransactionResponse = {
  unsignedXdr: string;
  txHash: string;
};

type DeployEscrowResponse = {
  unsignedXdr: string;
  txHash: string;
  contractId: string; // predicted C… address before submit
};

type SendTransactionResponse = {
  txHash: string;
  ledger: number;
  contractId?: string;
  escrow?: Escrow | EscrowSummary;
  code?: "STELLAR_TX_SUBMITTED" | "STELLAR_TX_SUBMITTED_INDEXER_LAGGING";
  message?: string;
};
```

---

## Read model (GET /escrows)

List and detail rows use **strings** for money fields and embed a camelCased `snapshot` of on-chain state.

### Asset — `EscrowAsset`

```ts
type EscrowAsset = {
  name: string | null;
  address: string | null;
  contractId: string | null;
};
```

### List / detail row — `EscrowSummary`

```ts
type EscrowSummary = {
  network: string;
  contractId: string;
  type: EscrowType;
  engagementId: string;
  status: EscrowStatus;
  amount: string | null; // both flavors; null until first on-chain projection
  balance: string;            // deposited − released (always present)
  asset: EscrowAsset | null;
  lastLedgerSeq: string;
  createdAt: string;
  updatedAt: string;
  snapshot: EscrowSnapshot;   // title, roles, milestones, …
};
```

### Snapshot (inside `EscrowSummary`)

{% tabs %}
{% tab title="Single-release snapshot" %}
```ts
type SingleReleaseEscrowSnapshot = {
  title: string;
  description: string;
  engagementId: string;
  trustline: Trustline;
  platformFee: string; // decimal string
  amount: string;
  roles: Roles;
  milestones: SingleReleaseMilestone[];
  dispute?: Dispute;
  released?: boolean;
  flags?: Record<string, unknown>;
};
```
{% endtab %}

{% tab title="Multi-release snapshot" %}
```ts
type MultiReleaseEscrowSnapshot = {
  title: string;
  description: string;
  engagementId: string;
  trustline: Trustline;
  platformFee: string;
  roles: MultiReleaseRoles;
  milestones: Array<{
    description: string;
    amount: string; // decimal string on reads
    receiver: string;
    status?: string;
    evidence?: string;
    approvalsTarget?: number;
    approvals?: MilestoneApprovals;
    released?: boolean;
    dispute?: {
      isDisputed: boolean;
      reason: string;
      resolved: boolean;
    };
  }>;
  flags?: Record<string, unknown>;
};
```
{% endtab %}
{% endtabs %}

```ts
type EscrowSnapshot = SingleReleaseEscrowSnapshot | MultiReleaseEscrowSnapshot;
```

### Detail — `EscrowDetail` / `GetEscrowResponse`

```ts
type EscrowEvent = {
  kind: string;
  actor: string | null;
  ledgerSeq: string;
  txHash: string;
  ledgerClosedAt: string;
  topics: string[];
  payload: Record<string, unknown>;
};

type EscrowDeposit = {
  fromAddress: string;
  amount: string;
  asset: string;
  txHash?: string;
  ledgerSeq?: string;
  ledgerClosedAt?: string;
};

type EscrowDetail = {
  escrow: EscrowSummary;
  events: EscrowEvent[];
  deposits: EscrowDeposit[];
};
```

### Pagination — `KeysetPage`

```ts
type KeysetPage = {
  data: EscrowSummary[]; // or EscrowEvent[] for events
  hasMore: boolean;
  nextCursor: string | null;
};

type ListEscrowsResponse = KeysetPage; // data: EscrowSummary[]
type ListEscrowEventsResponse = KeysetPage; // data: EscrowEvent[]
```

### Batch helpers

```ts
type EscrowDetailsItem = {
  escrow: EscrowSummary;
  deposits: EscrowDeposit[];
};

type BatchEscrowDetailsResponse = {
  data: EscrowDetailsItem[];
};

type EscrowMilestones = {
  contractId: string;
  type: EscrowType;
  milestones: SingleReleaseMilestone[] | MultiReleaseMilestone[];
};

type EscrowFinancial = {
  contractId: string;
  type: EscrowType;
  asset: string;
  platformFee: string;
  amount: string;
  totalDeposited: string;
  totalReleased: string;
  pendingRelease: string;
  nextRelease: { milestoneIndex: number | null; amount: string } | null;
  balance: string;
};
```

### List query — `ListEscrowsParams`

```ts
type ListEscrowsParams = {
  scope?: "mine" | "all";
  status?: EscrowStatus;
  type?: EscrowType; // same values as the response `type` field
  engagementId?: string;
  contractIds?: string[];
  participant?: string;
  role?: Role;
  platformId?: string;
  subjectId?: string;
  createdAfter?: string;
  createdBefore?: string;
  limit?: number;
  cursor?: string;
  sort?: "createdAt" | "updatedAt";
  order?: "asc" | "desc";
};

type BatchContractIdsParams = {
  contractIds: string[];
};

type ListEscrowEventsParams = {
  limit?: number;
  order?: "asc" | "desc";
  cursor?: string;
};
```

---

## Errors

API failures use RFC 9457 Problem Details (`ApiProblemDetails`) plus escrow-specific codes (`EscrowErrorCode`, `ESCROW_ERROR_CODES`).

See [Errors](/escrow-react-sdk/errors) for the full error reference.

---

## Quick map

| You want to… | Start with |
| --- | --- |
| Deploy an escrow | `DeploySingleReleaseEscrowPayload` / `DeployMultiReleaseEscrowPayload` |
| Fund / release / dispute | Matching `*Payload` in the Operate section |
| Show a list in the UI | `EscrowSummary` + `ListEscrowsResponse` |
| Show one escrow | `EscrowDetail` (`GetEscrowResponse`) |
| Sign & submit | `BuildTransactionResponse` → wallet → `SendTransactionResponse` |
| Handle failures | `ApiProblemDetails` ([Errors](/escrow-react-sdk/errors)) |
