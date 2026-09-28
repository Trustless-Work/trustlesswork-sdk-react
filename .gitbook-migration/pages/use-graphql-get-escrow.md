---
description: GraphQL escrow(contractId) — detail with financial, deposits, and events.
---

# useGraphqlGetEscrow

GraphQL `escrow(contractId:)` — detail with financial, deposits, and events.

### Import

```tsx
import { useGraphqlGetEscrow } from "@trustless-work/escrow/hooks/graphql";
```

### Signature

```ts
function useGraphqlGetEscrow(): {
  getEscrow: (variables: GraphqlGetEscrowVariables) => Promise</* GraphqlEscrow */>;
};
```

`GraphqlGetEscrowVariables`:

```ts
{
  contractId: string;
  eventsLimit?: number;
  eventsCursor?: string;
  eventsOrder?: "asc" | "desc";
}
```

### Example

```tsx
import { useGraphqlGetEscrow } from "@trustless-work/escrow/hooks/graphql";
import { useQuery } from "@tanstack/react-query";

const { getEscrow } = useGraphqlGetEscrow();

const { data } = useQuery({
  queryKey: ["gql-escrow", contractId, { eventsLimit: 20 }],
  queryFn: () =>
    getEscrow({
      contractId,
      eventsLimit: 20,
      eventsOrder: "desc",
    }),
  enabled: !!contractId,
});
```

Document constant: `GRAPHQL_GET_ESCROW` from `@trustless-work/escrow/graphql`.
