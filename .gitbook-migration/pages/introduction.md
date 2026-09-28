---
description: React/TypeScript client for Trustless Work Core API v2 escrows.
---

# Introduction

**`@trustless-work/escrow` v5** — React/TypeScript client for Trustless Work **Core API v2** escrows.

| Surface           | What it does                                                                                 |
| ----------------- | -------------------------------------------------------------------------------------------- |
| **REST operate**  | Build unsigned XDR → you sign → [`useSendTransaction`](/escrow-react-sdk/usesendtransaction) |
| **REST reads**    | `GET /escrows*` (list, detail, events, milestones, financial)                                |
| **GraphQL reads** | `POST /graphql` (`escrow` / `escrows`)                                                       |

Identity is always **`contractId`** (Soroban `C…`). Escrow types: `single-release` | `multi-release`.

{% hint style="info" %}
Auth, users, platforms, wallets, admin, and access grants are **out of scope** for this package.
{% endhint %}

### Quick links

<table data-view="cards"><thead><tr><th>Title</th><th data-card-target data-type="content-ref">Link</th></tr></thead><tbody><tr><td>Getting started</td><td><a href="/escrow-react-sdk/getting-started">Getting Started</a></td></tr><tr><td>Architecture</td><td><a href="/escrow-react-sdk/architecture">Architecture</a></td></tr><tr><td>Operate hooks</td><td><a href="/escrow-react-sdk/escrows">Operate</a></td></tr><tr><td>REST reads</td><td><a href="/escrow-react-sdk/indexer">REST Reads</a></td></tr><tr><td>GraphQL</td><td><a href="/escrow-react-sdk/graphql">GraphQL</a></td></tr><tr><td>NPM package</td><td><a href="https://www.npmjs.com/package/@trustless-work/escrow">@trustless-work/escrow</a></td></tr></tbody></table>

### What you'll do with the SDK

- Deploy escrows with [`useDeployEscrow`](/escrow-react-sdk/escrows/usedeployescrow) — single-release or multi-release.
- Fund, update, manage milestones, approve, release, dispute, resolve, and withdraw.
- Read escrows via [REST](/escrow-react-sdk/indexer) or [GraphQL](/escrow-react-sdk/graphql).
- Submit signed XDR with [`useSendTransaction`](/escrow-react-sdk/usesendtransaction).

{% hint style="warning" %}
Read amounts are **human decimal strings** (e.g. `"250.5"`). Do **not** divide by `1e7`. Operate payloads still use human **numbers**.
{% endhint %}

### Environment

`development` and `mainNet` currently both point at:

```
https://beta.api.trustlesswork.com
```

Pass any Core API `baseURL` string when you need another host. Get an API key from the Trustless Work dApp.

### Migrating?

See [Migration from v3 / v4](/escrow-react-sdk/migration) for breaking changes and replacement hooks.
