---
description: GraphQL escrows(...) — keyset list twin of REST GET /escrows.
---

# useGraphqlListEscrows

GraphQL `escrows(...)` — keyset list (twin of REST `GET /escrows`).

### Import

```tsx
import { useGraphqlListEscrows } from "@trustless-work/escrow/hooks/graphql";
```

### Signature

```ts
function useGraphqlListEscrows(): {
  listEscrows: (
    variables?: GraphqlListEscrowsVariables,
  ) => Promise</* GraphqlEscrowPage */>;
};
```

`GraphqlListEscrowsVariables` mirrors REST list filters: `scope`, `status`, `type`, `engagementId`, `contractIds`, `participant`, `role`, `platformId`, `subjectId`, `createdAfter`, `createdBefore`, `limit`, `cursor`, `sort`, `order`.

### Example

```tsx
import { useGraphqlListEscrows } from "@trustless-work/escrow/hooks/graphql";
import { useQuery } from "@tanstack/react-query";

const { listEscrows } = useGraphqlListEscrows();

const { data } = useQuery({
  queryKey: ["gql-escrows", "mine"],
  queryFn: () =>
    listEscrows({
      scope: "mine",
      limit: 20,
      sort: "createdAt",
      order: "desc",
    }),
});

// data → GraphqlEscrowPage (items + cursor fields)
```

Document constant: `GRAPHQL_LIST_ESCROWS` from `@trustless-work/escrow/graphql`.
