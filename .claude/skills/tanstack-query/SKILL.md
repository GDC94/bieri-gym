---
name: tanstack-query
description: TanStack Query v5 patterns with jotai-tanstack-query integration and SSE protocol. Trigger when building queries, mutations, data fetching, caching, or working with server state.
user-invocable: true
---

# TanStack Query + Jotai Integration Guide v1.0

## Overview

This project uses TanStack Query v5 integrated with Jotai via `jotai-tanstack-query`. All server state management follows strict patterns for consistency and maintainability.

---

## 1. Query Key Factory Pattern

**MANDATORY**: All query keys must be defined in a centralized factory file.

### Structure
```typescript
// queries/queryKeys.ts
export const featureKeys = {
  all: ["feature"] as const,

  // Nested scope
  subFeature: () => [...featureKeys.all, "sub-feature"] as const,

  // With parameters
  detail: (id: string) => [...featureKeys.all, "detail", id] as const,

  // Multiple parameters
  list: (chain: string, filters?: FilterParams) =>
    [...featureKeys.all, "list", chain, filters] as const,
} as const;
```

### Project Example (from `queryKeys.ts`)
```typescript
export const walletManagerKeys = {
  all: ["wallet-manager"] as const,
  accountManagement: () =>
    [...walletManagerKeys.all, "account-management"] as const,
  balance: (chain: string) =>
    [...walletManagerKeys.accountManagement(), "balance", chain] as const,
  positions: (chain: string) =>
    [...walletManagerKeys.accountManagement(), "positions", chain] as const,
  tradeSummary: (chain: string) =>
    [...walletManagerKeys.accountManagement(), "trade-summary", chain] as const,
} as const;
```

### Rules
- Use `as const` for type safety and autocomplete
- Nest keys hierarchically for easy invalidation
- Parameters should be the last elements in the array
- Export query keys from a dedicated `queryKeys.ts` file

---

## 2. Query Options Pattern

**MANDATORY**: Define query options as reusable functions.

### Structure
```typescript
import { type UseQueryOptions } from "@tanstack/react-query";

const STALE_TIME = 1000 * 60 * 5; // 5 minutes
const GC_TIME = 1000 * 60 * 10; // 10 minutes

export const featureQueryOptions = (
  param: string,
  enabled: boolean = true,
): UseQueryOptions<ResponseType, Error> => ({
  queryKey: featureKeys.detail(param),
  queryFn: () => fetchFeature(param),
  staleTime: STALE_TIME,
  gcTime: GC_TIME,
  retry: 3,
  refetchOnWindowFocus: true,
  refetchOnMount: true,
  enabled,
});
```

### Project Example (from `useAccountManagementTradeSummary.ts`)
```typescript
const TRADE_SUMMARY_STALE_TIME = 1000 * 60 * 5;
const TRADE_SUMMARY_GC_TIME = 1000 * 60 * 10;

export const tradeSummaryQueryOptions = (
  chain: string = "solana",
  enabled: boolean = true,
): UseQueryOptions<TradeSummaryApiResponse, Error> => ({
  queryKey: walletManagerKeys.tradeSummary(chain),
  queryFn: () => fetchTradeSummary(chain),
  staleTime: TRADE_SUMMARY_STALE_TIME,
  gcTime: TRADE_SUMMARY_GC_TIME,
  retry: 3,
  refetchOnWindowFocus: true,
  refetchOnMount: true,
  enabled,
});
```

### Benefits
- Reusable across `useQuery` and `prefetchQuery`
- Type-safe configuration
- Centralized cache settings

---

## 3. useQuery with Adapter Pattern

**MANDATORY**: Transform API responses using the `select` option with adapters.

### Structure
```typescript
"use client";

import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { formatPrice, type FormatPriceContext } from "@/lib/utils/numberFormatting/core/formatPrice";

// Adapter function (pure, testable)
const adaptResponse = (
  response: ApiResponse,
  context: FormatPriceContext,
): AdaptedResponse => ({
  formattedValue: formatPrice(response.value, context),
  raw: response,
});

// Hook
export const useFeatureData = (param: string, enabled = true) => {
  const shouldDisplayInUsd = useAtomValue(atomShowPricesInUsd);
  const { data: solPrice } = useAtomValue(atomQuerySolUsd);

  const formatContext = useMemo<FormatPriceContext>(
    () => ({
      shouldDisplayInUsd,
      solPrice: solPrice ?? 0,
      isValueInUsd: true,
    }),
    [shouldDisplayInUsd, solPrice],
  );

  const selectFn = useCallback(
    (data: ApiResponse) => adaptResponse(data, formatContext),
    [formatContext],
  );

  return useQuery({
    ...featureQueryOptions(param, enabled),
    select: selectFn,
  });
};
```

### Rules
- Adapters are pure functions (no side effects)
- Use `useMemo` for context objects
- Use `useCallback` for select functions to prevent unnecessary re-renders
- Always include `raw` property for access to original data

---

## 4. SSE (Server-Sent Events) Queries

This project uses SSE for real-time data streams via `@microsoft/fetch-event-source`.

### SSE Query Options (from `src/lib/api/sse.ts`)
```typescript
import { sseQueryOptions } from "@/lib/api/sse";

// Usage
const queryOptions = (chain: string) =>
  sseQueryOptions<ResponseType>(
    featureKeys.stream(chain),
    getPathService().featureStream({ chain }),
    { enabled: true },
  );
```

### How SSE Works in This Project
```typescript
export const sseQueryOptions = <T>(
  queryKey: QueryKey,
  url: string,
  options?: Partial<UseQueryOptions<T>>,
  transform?: (data: T) => T | typeof IGNORE_SYMBOL,
): UseQueryOptions<T> => ({
  queryKey,
  queryFn: async ({ signal }) => {
    const queryClient = store.get(queryClientAtom);
    return connectToSSE<T>(url, signal, (data) => {
      const parsedData = transform ? transform(data) : data;
      if (parsedData === IGNORE_SYMBOL) return;
      queryClient.setQueryData(queryKey, parsedData);
    }) as Promise<T>;
  },
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  ...options,
});
```

### SSE Query Rules
- SSE queries disable `refetchOnMount` and `refetchOnWindowFocus`
- Data updates happen via `queryClient.setQueryData`
- Use `transform` parameter to filter or modify incoming data
- Always use `signal` for proper cleanup on unmount

### Project Example (from `useAccountManagementBalance.ts`)
```typescript
const queryOptions = (chain: string = "solana") =>
  sseQueryOptions<AccountManagementBalanceResponse>(
    walletManagerKeys.balance(chain),
    getPathService().accountManagementBalanceStream({ chain }),
    { enabled: true },
  );

export const useAccountManagementBalance = (chain: string = "solana") => {
  const shouldDisplayInUsd = useAtomValue(atomShowPricesInUsd);
  const { data: solPrice } = useAtomValue(atomQuerySolUsd);

  return useQuery({
    ...queryOptions(chain),
    select: (data) =>
      adaptAccountManagementBalance(data, {
        shouldDisplayInUsd,
        solPrice: solPrice ?? 0,
      }),
  });
};
```

---

## 5. Jotai-TanStack Query Integration

### atomWithQuery
For queries that need to be shared across components via Jotai atoms.

```typescript
import { atomWithQuery } from "jotai-tanstack-query";

export const atomFeatureData = atomWithQuery((get) => ({
  queryKey: featureKeys.detail(get(atomSelectedId)),
  queryFn: async ({ queryKey: [, , id] }) => {
    const response = await axiosInstance.get(getPathService().feature({ id }));
    return response.data;
  },
  staleTime: 1000 * 60 * 5,
}));

// Usage in component
const [{ data, isLoading, error }] = useAtom(atomFeatureData);
```

### atomWithMutation
For mutations that need Jotai integration.

```typescript
import { atomWithMutation } from "jotai-tanstack-query";
import { queryClientAtom } from "jotai-tanstack-query";

export const atomMutationUpdateFeature = atomWithMutation((get) => ({
  mutationKey: ["update-feature"],
  mutationFn: async (params: UpdateParams) => {
    const response = await axiosInstance.put(
      getPathService().feature({ id: params.id }),
      params.data,
    );
    return response.data;
  },
  onSuccess: () => {
    toast("Feature updated successfully", "success");
    const queryClient = get(queryClientAtom);
    queryClient.invalidateQueries({ queryKey: featureKeys.all });
  },
  onError: (error) => {
    toast(error.message, "error");
  },
}));

// Usage in component
const [{ mutate, isPending }] = useAtom(atomMutationUpdateFeature);
```

### Project Example (from `atomMutationUpdateWalletName.ts`)
```typescript
const atomMutationUpdateWalletName = atomWithMutation((get) => ({
  mutationKey: ["update-wallet-name"],
  mutationFn: async ({ walletId, walletName, password }) => {
    const response = await axiosInstance.put(
      getPathService().walletDetails({ walletId }),
      { name: walletName, securityData: { password } },
    );
    return response;
  },
  onSuccess: () => {
    toast("Wallet name updated successfully", "success");
    const queryClient = get(queryClientAtom);
    queryClient.invalidateQueries({ queryKey: ["wallets"] });
  },
}));
```

---

## 6. Query Invalidation Patterns

### After Mutations
```typescript
onSuccess: () => {
  const queryClient = get(queryClientAtom);

  // Invalidate all queries in scope
  queryClient.invalidateQueries({ queryKey: featureKeys.all });

  // Invalidate specific query
  queryClient.invalidateQueries({ queryKey: featureKeys.detail(id) });

  // Invalidate with predicate
  queryClient.invalidateQueries({
    predicate: (query) =>
      query.queryKey[0] === "feature" && query.queryKey[2] === chainId,
  });
};
```

### Manual Invalidation
```typescript
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: featureKeys.list(chain) });
```

---

## 7. Type Definitions

### API Response Types
```typescript
// types/feature.types.ts
export interface FeatureApiResponse {
  id: string;
  value: string;
  timestamp: number;
}

export interface AdaptedFeature {
  id: string;
  formattedValue: string;
  raw: FeatureApiResponse;
}
```

### Query Options Type
```typescript
import type { UseQueryOptions } from "@tanstack/react-query";

export const featureQueryOptions = (
  param: string,
): UseQueryOptions<FeatureApiResponse, Error, AdaptedFeature> => ({
  // TData = FeatureApiResponse (raw data)
  // TError = Error
  // TSelect = AdaptedFeature (after select transform)
});
```

---

## 8. File Organization

```
feature/
├── queries/
│   ├── queryKeys.ts           # Query key factory
│   ├── useFeatureData.ts      # useQuery hook
│   ├── useFeatureList.ts      # Another query hook
│   └── feature.types.ts       # Types for this feature
├── mutations/
│   └── useUpdateFeature.ts    # useMutation hook
├── components/
│   └── FeatureView.tsx
└── page.tsx
```

Or with Jotai atoms:
```
atoms/
├── atomQueryFeature.ts        # atomWithQuery
└── atomMutationFeature.ts     # atomWithMutation
```

---

## 9. Common Patterns Checklist

When creating a new query:

- [ ] Define query key in `queryKeys.ts` file
- [ ] Create typed query options function
- [ ] Define API response type and adapted type
- [ ] Create adapter function for data transformation
- [ ] Use `select` with `useCallback` for transformation
- [ ] Set appropriate `staleTime` and `gcTime`
- [ ] Handle loading and error states in component

When creating a new mutation:

- [ ] Use `atomWithMutation` for Jotai integration
- [ ] Define `mutationKey` for devtools
- [ ] Implement `onSuccess` with query invalidation
- [ ] Implement `onError` with toast notification
- [ ] Return appropriate data for optimistic updates

---

## 10. Anti-Patterns to Avoid

### DON'T: Inline query keys
```typescript
// BAD
useQuery({ queryKey: ["feature", id], ... });

// GOOD
useQuery({ queryKey: featureKeys.detail(id), ... });
```

### DON'T: Transform data outside select
```typescript
// BAD
const { data } = useQuery(options);
const formatted = formatData(data);

// GOOD
const { data } = useQuery({
  ...options,
  select: (data) => formatData(data),
});
```

### DON'T: Create queryClient in components
```typescript
// BAD
const queryClient = new QueryClient();

// GOOD
const queryClient = useQueryClient();
// or with Jotai:
const queryClient = get(queryClientAtom);
```

### DON'T: Forget cleanup on SSE
```typescript
// BAD
queryFn: async () => connectToSSE(url, ...);

// GOOD
queryFn: async ({ signal }) => connectToSSE(url, signal, ...);
```

---

## References

### Project Files Using These Patterns

1. **Query Key Factory**: `src/app/(cook)/wallet-manager/queries/queryKeys.ts`
2. **Query Options Pattern**: `src/app/(cook)/wallet-manager/queries/spot/useAccountManagementTradeSummary.ts`
3. **SSE Queries**: `src/app/(cook)/wallet-manager/queries/spot/useAccountManagementBalance.ts`
4. **SSE Infrastructure**: `src/lib/api/sse.ts`
5. **atomWithMutation**: `src/atoms/atomMutationUpdateWalletName.ts`
6. **atomWithQuery + SSE**: `src/app/(cook)/kitchen/queries/kitchenQueryBuilder.ts`

### Official Documentation

- [TanStack Query v5](https://tanstack.com/query/latest)
- [jotai-tanstack-query](https://jotai.org/docs/extensions/query)
- [SSE Protocol](https://tanstack.com/ai/latest/docs/protocol/sse-protocol)
