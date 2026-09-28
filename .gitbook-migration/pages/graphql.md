---
description: GraphQL read surface — POST /graphql for escrow and escrows queries.
---

# GraphQL

GraphQL reads go through `POST /graphql`. Prefer this when you want escrow + financial + deposits + events in one round-trip.

Import from `@trustless-work/escrow/hooks/graphql` or `@trustless-work/escrow/graphql`.

### Hooks

| Hook | Query |
| --- | --- |
| [`useGraphqlGetEscrow`](/escrow-react-sdk/graphql/usegraphqlgetescrow) | `escrow(contractId)` + financial / deposits / events |
| [`useGraphqlListEscrows`](/escrow-react-sdk/graphql/usegraphqllistescrows) | `escrows(...)` (same filters as REST list) |

Documents: `GRAPHQL_GET_ESCROW`, `GRAPHQL_LIST_ESCROWS`.

### Quick example

```tsx
import {
  useGraphqlGetEscrow,
  useGraphqlListEscrows,
} from "@trustless-work/escrow/hooks/graphql";
import { useQuery } from "@tanstack/react-query";

const { getEscrow } = useGraphqlGetEscrow();
const { listEscrows } = useGraphqlListEscrows();

useQuery({
  queryKey: ["gql-escrow", contractId],
  queryFn: () => getEscrow({ contractId, eventsLimit: 20 }),
  enabled: !!contractId,
});

useQuery({
  queryKey: ["gql-escrows", "mine"],
  queryFn: () => listEscrows({ scope: "mine", limit: 20 }),
});
```

### Wire types

GraphQL wire types (`GraphqlEscrow`, `GraphqlEscrowPage`, `GraphqlEscrowFinancial`, …) live on `@trustless-work/escrow` / `@trustless-work/escrow/graphql`.

{% hint style="info" %}
REST and GraphQL share the same Core identity model (`contractId`) and filter semantics (`scope`, `status`, `type`, …). Choose based on nesting needs, not different product surfaces.
{% endhint %}

See also [REST Reads](/escrow-react-sdk/indexer) and [Types](/escrow-react-sdk/types).
