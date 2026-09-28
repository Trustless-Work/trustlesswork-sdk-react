---
description: Install @trustless-work/escrow v5 and wrap your app with TrustlessWorkConfig.
---

# Getting Started

### Install

```bash
npm install @trustless-work/escrow@5
# or
yarn add @trustless-work/escrow@5
# or
pnpm add @trustless-work/escrow@5
```

Peer dependencies: `react` and `react-dom` `>=18 <20`.

{% hint style="info" %}
If you publish/install under an npm dist-tag (e.g. `beta`), use that tag instead of `@5` so `latest` can stay on the audited Core v1 line.
{% endhint %}

### Configure the provider

{% stepper %}
{% step %}
**Create a provider**

Wrap your app (or feature tree) with `TrustlessWorkConfig`.

```tsx
"use client";

import {
  development,
  TrustlessWorkConfig,
} from "@trustless-work/escrow";

export function TrustlessWorkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";

  return (
    <TrustlessWorkConfig baseURL={development} apiKey={apiKey}>
      {children}
    </TrustlessWorkConfig>
  );
}
```
{% endstep %}

{% step %}
**Optional auth / platform headers**

```tsx
<TrustlessWorkConfig
  baseURL={development}
  apiKey={apiKey}
  getAccessToken={() => sessionToken}
  defaultHeaders={{ "X-TW-Platform": platformId }}
>
  {children}
</TrustlessWorkConfig>
```
{% endstep %}

{% step %}
**Call a hook**

```tsx
import { useListEscrows } from "@trustless-work/escrow/hooks/rest";
import { useQuery } from "@tanstack/react-query";

const { listEscrows } = useListEscrows();

useQuery({
  queryKey: ["escrows", "mine"],
  queryFn: () => listEscrows({ scope: "mine", limit: 20 }),
});
```
{% endstep %}
{% endstepper %}

### Config props

| Prop | Role |
| --- | --- |
| `baseURL` | Core API host (`development` / `mainNet` helpers, or any URL string) |
| `apiKey` | `x-api-key` header |
| `getAccessToken` | Optional Bearer token getter (re-read per request) |
| `defaultHeaders` | Merged into every request (e.g. `X-TW-Platform`) |

### Without React

```ts
import { TrustlessWorkClient, development } from "@trustless-work/escrow";

const client = new TrustlessWorkClient({
  baseURL: development,
  apiKey: process.env.API_KEY,
});

await client.rest.listEscrows({ scope: "mine", limit: 20 });
await client.graphql.getEscrow({ contractId });
```

### Next steps

* [Architecture](/escrow-react-sdk/architecture) — entry points and build → sign → send
* [Operate](/escrow-react-sdk/escrows) — mutate hooks
* [REST Reads](/escrow-react-sdk/indexer) — `GET /escrows*`
* [Errors](/escrow-react-sdk/errors) — `toTrustlessWorkError` and Problem Details
