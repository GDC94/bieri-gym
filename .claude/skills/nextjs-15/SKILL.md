---
name: nextjs-15
description: >
  Next.js 15 App Router patterns.
  Trigger: When working in Next.js App Router (app/), Server Components vs Client Components, Server Actions, Route Handlers, caching/revalidation, streaming/Suspense, metadata, error handling, parallel routes, and middleware.
license: MIT
metadata:
  author: germanderbescatoni
  version: "2.1"
  scope: [root, ui]
  auto_invoke: "App Router / Server Actions / Caching / Metadata"
  source: "Context7 + Next.js Official Docs (January 2026)"
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

# Next.js 15 App Router - Complete Reference

---

# PROJECT-SPECIFIC PATTERNS (Cooking)

## Architecture Overview

This project uses a **hybrid architecture**:

1. **Server Components** → Initial data streaming via Suspense
2. **Client Components** → Interactive pages with Jotai + TanStack Query
3. **jotai-tanstack-query** → Bridges server data with client state

```
┌─────────────────────────────────────────────────────────────┐
│ Server Component (WalletsFetcher)                           │
│   ↓ fetch data with cache: 'no-store'                       │
│   ↓ streams via Suspense                                    │
├─────────────────────────────────────────────────────────────┤
│ Client Component (WalletsProvider)                          │
│   ↓ receives data as props                                  │
│   ↓ hydrates Jotai atom (atomServerWallets)                 │
├─────────────────────────────────────────────────────────────┤
│ Client Component (Page)                                     │
│   ↓ uses atomWithQuery for reactive updates                 │
│   ↓ merges server data with client queries                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Project File Structure

```
src/app/
├── layout.tsx              # Root layout with Providers
├── providers.tsx           # QueryClient + Jotai + Wallet providers
├── error.tsx               # Global error boundary
├── not-found.tsx           # 404 page
├── page.tsx                # Landing page
├── (cook)/                 # Route group for authenticated app
│   ├── layout.tsx          # Streams data via Suspense
│   ├── error.tsx           # App-specific error
│   ├── wallet-manager/
│   │   └── page.tsx        # "use client" - interactive page
│   ├── trading-station/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── orders/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── ...
├── server-components/      # Server-side data fetchers
│   ├── Wallets/
│   │   ├── WalletsFetcher.tsx   # Server Component
│   │   └── WalletsProvider.tsx  # Client hydration
│   └── Positions/
│       ├── PositionsFetcher.tsx
│       └── PositionsProvider.tsx
└── login/
    └── page.tsx
```

---

## Server Fetcher + Client Provider Pattern

### Step 1: Server Component Fetcher

```typescript
// src/app/server-components/Wallets/WalletsFetcher.tsx
import { getApiUrl } from "@/lib/env";
import { getAccessToken } from "@/lib/utils/cookies";
import { WalletsProvider } from "./WalletsProvider";

async function fetchWallets(): Promise<Wallet[] | null> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) return null;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${getApiUrl()}/wallets`, {
      headers: { authorization: `Bearer ${accessToken}` },
      signal: controller.signal,
      cache: "no-store", // Always fresh data
    });

    clearTimeout(timeoutId);
    if (!response.ok) return null;

    return response.json();
  } catch {
    return null;
  }
}

export async function WalletsFetcher() {
  const wallets = await fetchWallets();
  if (!wallets) return null;
  return <WalletsProvider wallets={wallets} />;
}
```

### Step 2: Client Provider (Hydration)

```typescript
// src/app/server-components/Wallets/WalletsProvider.tsx
"use client";

import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { atomServerWallets } from "@/atoms/atomWallets";

export function WalletsProvider({ wallets }: { wallets: Wallet[] | null }) {
  const saveWallets = useSetAtom(atomServerWallets);

  useEffect(() => {
    if (Array.isArray(wallets)) {
      saveWallets(wallets);
    }
  }, [wallets, saveWallets]);

  return null; // Renders nothing, just hydrates state
}
```

### Step 3: Layout with Streaming

```typescript
// src/app/(cook)/layout.tsx
import { Suspense } from "react";
import { WalletsFetcher } from "../server-components/Wallets";
import { PositionsFetcher } from "../server-components/Positions";
import CookInnerLayout from "./InnerLayout";

export default async function CookLayout({ children }: PropsWithChildren) {
  return (
    <>
      {/* Stream data while shell renders */}
      <Suspense>
        <PositionsFetcher />
      </Suspense>
      <Suspense>
        <WalletsFetcher />
      </Suspense>
      <CookInnerLayout>{children}</CookInnerLayout>
    </>
  );
}
```

---

## Data Fetching with jotai-tanstack-query

### Pattern: atomWithQuery

```typescript
// src/atoms/atomQueryOrdersByWallet.ts
import { atomWithQuery } from "jotai-tanstack-query";
import { getPathService } from "@/lib/services/pathService";
import { atomSelectedWallet } from "@/atoms";
import { axiosInstance } from "@/lib/api";

const atomQueryOrdersByWallet = atomWithQuery((get) => ({
  queryKey: ["orders", "limit-orders-by-wallet", get(atomSelectedWallet)?.id],
  queryFn: async () => {
    const selectedWallet = get(atomSelectedWallet);
    if (!selectedWallet) return { items: [] };

    const response = await axiosInstance.get(
      getPathService().limitOrdersByWallet({
        walletAddress: selectedWallet.address,
      })
    );
    return { items: response.data?.items };
  },
  staleTime: 30_000,
  gcTime: 300_000,
  refetchInterval: 15_000,
}));

export { atomQueryOrdersByWallet };
```

### Pattern: Merge Server + Client Data

```typescript
// src/lib/queries/usePositionsByWallet.ts
import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";

// Server data atom (hydrated by Provider)
export const atomServerPositions = atom<PositionType[] | null>(null);

// Client query atom
const _atomSelectedWalletPositionsQuery = atomWithQuery((get) => {
  const selectedWallet = get(atomSelectedWallet);
  return queryOptions(selectedWallet?.id);
});

// Merged atom: prefer client data when available
export const atomSelectedWalletPositionsQuery = atom((get) => {
  const query = get(_atomSelectedWalletPositionsQuery);
  const serverPositions = get(atomServerPositions);

  const mergedData = query.data ?? serverPositions;
  const isPending = query.isPending && !mergedData;

  return { ...query, data: mergedData, isPending };
});
```

---

## PathService for API Routes

All API paths go through `pathService.ts`:

```typescript
// src/lib/services/pathService.ts
import { getPathService } from "@/lib/services/pathService";

// Usage
const url = getPathService().limitOrdersByWallet({ walletAddress });
const url = getPathService().positionsByWallet({ walletId });
const url = getPathService().walletBalance({ walletId });
```

---

## Client Pages Pattern

Pages are Client Components because they need interactivity:

```typescript
// src/app/(cook)/wallet-manager/page.tsx
"use client";

import { useRequireSecuritySetup } from "@/lib/hooks/useRequireSecuritySetup";
import { WalletManagerGrid, TotalBalance, WalletPanelContent } from "./components";

export default function WalletManagerPage() {
  useRequireSecuritySetup(); // Client hook

  return (
    <WalletManagerGrid>
      <TotalBalance />
      <WalletPanelContent />
    </WalletManagerGrid>
  );
}
```

---

## Providers Setup

```typescript
// src/app/providers.tsx
"use client";

import { Provider as JotaiProvider } from "jotai";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClientAtom } from "jotai-tanstack-query";
import { useHydrateAtoms } from "jotai/react/utils";

export const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider store={store}>
        <HydrateAtoms>
          <SolanaWalletProvider>{children}</SolanaWalletProvider>
        </HydrateAtoms>
      </JotaiProvider>
    </QueryClientProvider>
  );
}
```

---

## Project-Specific Conventions

### What This Project Uses
- Route groups: `(cook)` for authenticated routes
- Server Components for initial data streaming
- Client Components for interactive pages
- `jotai-tanstack-query` for data fetching
- `pathService` for centralized API routes
- Suspense boundaries in layouts for streaming

### What This Project Does NOT Use
- Server Actions (no `actions.ts` files)
- Middleware (`middleware.ts`)
- Route Handlers / API Routes (`app/api/`)
- Static metadata in pages (only in root layout)

---

## Quick Reference: Creating a New Feature

```typescript
// 1. Add path to pathService if new API endpoint
// src/lib/services/pathService.ts
myNewEndpoint: (params: { id: string }) => `${this.baseUrl}/my-endpoint/${params.id}`,

// 2. Create atom with query
// src/atoms/atomQueryMyFeature.ts
export const atomQueryMyFeature = atomWithQuery((get) => ({
  queryKey: ["my-feature", get(atomSelectedWallet)?.id],
  queryFn: async () => {
    const response = await axiosInstance.get(getPathService().myNewEndpoint({ id }));
    return response.data;
  },
}));

// 3. Create page as Client Component
// src/app/(cook)/my-feature/page.tsx
"use client";

import { useAtomValue } from "jotai";
import { atomQueryMyFeature } from "@/atoms/atomQueryMyFeature";

export default function MyFeaturePage() {
  const { data, isPending } = useAtomValue(atomQueryMyFeature);

  if (isPending) return <Skeleton />;
  return <MyFeatureContent data={data} />;
}
```

---

# NEXT.JS 15 GENERAL REFERENCE

The following sections cover general Next.js 15 patterns. For this project, prefer the patterns above.

---

## App Router File Conventions

```
app/
├── layout.tsx          # Root layout (required) - wraps all pages
├── page.tsx            # Home page (/)
├── loading.tsx         # Loading UI (automatic Suspense boundary)
├── error.tsx           # Error boundary (must be 'use client')
├── not-found.tsx       # 404 page
├── global-error.tsx    # Root error boundary (must define <html><body>)
├── (auth)/             # Route group (no URL impact)
│   ├── login/page.tsx  # /login
│   └── signup/page.tsx # /signup
├── @modal/             # Parallel route slot
│   └── (.)photo/[id]/page.tsx  # Intercepting route
├── api/
│   └── route.ts        # API Route Handler
├── _components/        # Private folder (not routed)
└── opengraph-image.tsx # Dynamic OG image
```

---

## Server Components (Default)

By default, all components in the App Router are Server Components.

### Benefits
- Direct database/API access without exposing backend
- Secrets stay on server (API keys, tokens)
- Reduced JavaScript bundle size
- Improved First Contentful Paint (FCP)
- Async/await natively supported

```typescript
// app/users/page.tsx - Server Component (default, no directive needed)
import { db } from '@/lib/db';

export default async function UsersPage() {
  // Fetch directly - runs on server only
  const users = await db.users.findMany();

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Protect Server-Only Code

```typescript
// lib/data.ts
import 'server-only'; // Build error if imported in Client Component

export async function getSecretData() {
  const res = await fetch('https://api.example.com/data', {
    headers: { authorization: process.env.API_KEY },
  });
  return res.json();
}
```

---

## Client Components

Add `"use client"` at the top of the file when you need:
- React hooks (`useState`, `useEffect`, etc.)
- Event handlers (`onClick`, `onChange`)
- Browser APIs (`localStorage`, `window`)
- Third-party libraries requiring client-side

```typescript
// app/components/Counter.tsx
"use client";

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### Composition Pattern: Server + Client

```typescript
// app/ui/modal.tsx (Client Component)
"use client";

export function Modal({ children }: { children: React.ReactNode }) {
  return <div className="modal">{children}</div>;
}

// app/page.tsx (Server Component)
import { Modal } from './ui/modal';
import { ServerContent } from './ServerContent'; // Server Component

export default function Page() {
  return (
    <Modal>
      <ServerContent /> {/* Server Component inside Client Component */}
    </Modal>
  );
}
```

### When to Use Each

| Need | Use |
|------|-----|
| Fetch data | Server Component |
| Access backend resources | Server Component |
| Keep secrets safe | Server Component |
| Reduce bundle size | Server Component |
| useState, useEffect | Client Component |
| onClick, onChange | Client Component |
| Browser APIs | Client Component |
| Custom hooks with state | Client Component |

---

## Server Actions

Asynchronous functions that run on the server, callable from client through forms or event handlers.

### Defining Server Actions

```typescript
// app/actions.ts
"use server";

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});

export async function createUser(formData: FormData) {
  // Validate
  const result = CreateUserSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
  });

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  // Mutate
  await db.users.create({ data: result.data });

  // Revalidate and redirect
  revalidatePath('/users');
  redirect('/users');
}
```

### Using with Forms (Progressive Enhancement)

```typescript
// app/users/new/page.tsx
import { createUser } from '@/app/actions';

export default function NewUserPage() {
  return (
    <form action={createUser}>
      <input name="name" required />
      <input name="email" type="email" required />
      <button type="submit">Create User</button>
    </form>
  );
}
```

### useActionState for Pending States

```typescript
// app/ui/SubmitButton.tsx
"use client";

import { useActionState } from 'react';
import { createUser } from '@/app/actions';

export function CreateUserForm() {
  const [state, action, pending] = useActionState(createUser, null);

  return (
    <form action={action}>
      <input name="name" required />
      <input name="email" type="email" required />
      {state?.error && <p className="text-red-500">{state.error}</p>}
      <button disabled={pending}>
        {pending ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
```

### Event Handler Invocation

```typescript
"use client";

import { incrementLike } from './actions';
import { useState } from 'react';

export function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes);

  return (
    <button
      onClick={async () => {
        const updatedLikes = await incrementLike();
        setLikes(updatedLikes);
      }}
    >
      Likes: {likes}
    </button>
  );
}
```

### Revalidation in Actions

```typescript
"use server";

import { revalidatePath, revalidateTag } from 'next/cache';

export async function updatePost(id: string, data: FormData) {
  await db.posts.update(id, Object.fromEntries(data));

  // Option 1: Revalidate specific path
  revalidatePath(`/posts/${id}`);

  // Option 2: Revalidate by tag
  revalidateTag('posts');

  // Option 3: Refresh current page
  // refresh(); // from 'next/cache'
}
```

### Cookies in Actions

```typescript
"use server";

import { cookies } from 'next/headers';

export async function setTheme(theme: string) {
  const cookieStore = await cookies();
  cookieStore.set('theme', theme);
}

export async function getTheme() {
  const cookieStore = await cookies();
  return cookieStore.get('theme')?.value ?? 'light';
}
```

---

## Data Fetching Patterns

### Parallel Fetching (Recommended)

```typescript
// app/dashboard/page.tsx
async function DashboardPage() {
  // Fetch in parallel - no waterfall
  const [users, posts, analytics] = await Promise.all([
    getUsers(),
    getPosts(),
    getAnalytics(),
  ]);

  return (
    <Dashboard users={users} posts={posts} analytics={analytics} />
  );
}
```

### Streaming with Suspense

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react';
import { PostFeed, Weather, UserStats } from './components';

export default function DashboardPage() {
  return (
    <section>
      {/* Each component streams independently */}
      <Suspense fallback={<p>Loading feed...</p>}>
        <PostFeed />
      </Suspense>
      <Suspense fallback={<p>Loading weather...</p>}>
        <Weather />
      </Suspense>
      <Suspense fallback={<p>Loading stats...</p>}>
        <UserStats />
      </Suspense>
    </section>
  );
}
```

### loading.tsx Convention

```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  return <DashboardSkeleton />;
}
```

Automatically wraps `page.tsx` in a Suspense boundary.

---

## Caching

### Four Caching Mechanisms

| Mechanism | What | Where | Duration |
|-----------|------|-------|----------|
| Request Memoization | fetch return values | Server | Per-request |
| Data Cache | Fetch responses | Server | Persistent (revalidatable) |
| Full Route Cache | HTML + RSC Payload | Server | Persistent (revalidatable) |
| Router Cache | RSC Payload | Client | Session-based |

### Fetch with Caching Options

```typescript
// Cache indefinitely (default for GET)
const data = await fetch('https://api.example.com/data');

// Revalidate every hour
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 3600 },
});

// No caching
const data = await fetch('https://api.example.com/data', {
  cache: 'no-store',
});

// Tag for on-demand revalidation
const data = await fetch('https://api.example.com/posts', {
  next: { tags: ['posts'] },
});
```

### React cache() for Non-Fetch

```typescript
import { cache } from 'react';
import { db } from '@/lib/db';

// Memoized per-request
export const getUser = cache(async (id: string) => {
  return db.users.findUnique({ where: { id } });
});
```

### On-Demand Revalidation

```typescript
"use server";

import { revalidatePath, revalidateTag } from 'next/cache';

// Revalidate specific path
export async function updatePage() {
  revalidatePath('/blog');
}

// Revalidate by tag
export async function updatePosts() {
  revalidateTag('posts');
}
```

---

## Route Handlers (API Routes)

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  const users = await db.users.findMany({
    where: query ? { name: { contains: query } } : undefined,
  });

  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const user = await db.users.create({ data: body });

  return NextResponse.json(user, { status: 201 });
}
```

### Dynamic Route Handlers

```typescript
// app/api/users/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await db.users.findUnique({ where: { id } });

  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.users.delete({ where: { id } });

  return new Response(null, { status: 204 });
}
```

### Cookies and Headers

```typescript
import { cookies, headers } from 'next/headers';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  const headersList = await headers();
  const referer = headersList.get('referer');

  // Set cookie in response
  const response = NextResponse.json({ success: true });
  response.cookies.set('session', 'value', { httpOnly: true });

  return response;
}
```

### Streaming Response

```typescript
export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      for (const chunk of ['Hello', ' ', 'World']) {
        controller.enqueue(encoder.encode(chunk));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      controller.close();
    },
  });

  return new Response(stream);
}
```

---

## Middleware

```typescript
// middleware.ts (root level)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check auth
  const token = request.cookies.get('token');

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Add headers
  const response = NextResponse.next();
  response.headers.set('x-custom-header', 'value');

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### Authentication Pattern

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/settings', '/profile'];
const authRoutes = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  // Redirect authenticated users away from auth pages
  if (authRoutes.some(route => pathname.startsWith(route)) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protect routes
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
```

---

## Metadata API

### Static Metadata

```typescript
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'My App',
    template: '%s | My App', // For child pages
  },
  description: 'App description',
  openGraph: {
    title: 'My App',
    description: 'App description',
    url: 'https://example.com',
    siteName: 'My App',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My App',
    description: 'App description',
  },
};
```

### Dynamic Metadata

```typescript
// app/posts/[slug]/page.tsx
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}
```

### Dynamic OG Images

```typescript
// app/posts/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(to bottom, #1a1a2e, #16213e)',
          color: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 48,
        }}
      >
        {post.title}
      </div>
    ),
    { ...size }
  );
}
```

---

## Error Handling

### error.tsx (Route Error Boundary)

```typescript
// app/dashboard/error.tsx
"use client"; // Required

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### global-error.tsx (Root Error Boundary)

```typescript
// app/global-error.tsx
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
```

### not-found.tsx

```typescript
// app/posts/[slug]/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <h2>Post Not Found</h2>
      <p>Could not find the requested post.</p>
      <Link href="/posts">View all posts</Link>
    </div>
  );
}

// In page.tsx
import { notFound } from 'next/navigation';

export default async function PostPage({ params }: Props) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound(); // Renders not-found.tsx
  }

  return <Post data={post} />;
}
```

### Expected Errors Pattern

```typescript
// Return errors as values, don't throw
"use server";

export async function createPost(formData: FormData) {
  const result = await db.posts.create(/* ... */);

  if (!result.success) {
    return { error: 'Failed to create post' }; // Return, don't throw
  }

  revalidatePath('/posts');
  redirect('/posts');
}
```

---

## Parallel Routes

### @folder Convention

```typescript
// app/layout.tsx
export default function Layout({
  children,
  analytics,
  team,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <>
      {children}
      {analytics}
      {team}
    </>
  );
}

// File structure:
// app/
// ├── layout.tsx
// ├── page.tsx
// ├── @analytics/
// │   ├── page.tsx
// │   └── default.tsx  <- Required for hard navigation
// └── @team/
//     ├── page.tsx
//     └── default.tsx
```

### default.tsx for Unmatched Slots

```typescript
// app/@analytics/default.tsx
export default function Default() {
  return null; // Or a fallback UI
}
```

### Conditional Rendering

```typescript
// app/dashboard/layout.tsx
import { checkUserRole } from '@/lib/auth';

export default function Layout({
  user,
  admin,
}: {
  user: React.ReactNode;
  admin: React.ReactNode;
}) {
  const role = checkUserRole();
  return role === 'admin' ? admin : user;
}
```

---

## Intercepting Routes

Match route segments from different levels:

| Convention | Matches |
|------------|---------|
| `(.)` | Same level |
| `(..)` | One level above |
| `(..)(..)` | Two levels above |
| `(...)` | Root app directory |

### Modal Pattern

```typescript
// File structure:
// app/
// ├── layout.tsx
// ├── @modal/
// │   ├── default.tsx
// │   └── (.)photo/[id]/
// │       └── page.tsx  <- Intercepted modal
// └── photo/[id]/
//     └── page.tsx      <- Full page

// app/@modal/(.)photo/[id]/page.tsx
import { Modal } from '@/components/Modal';
import { PhotoDetail } from '@/components/PhotoDetail';

export default function PhotoModal({ params }: { params: { id: string } }) {
  return (
    <Modal>
      <PhotoDetail id={params.id} />
    </Modal>
  );
}

// app/layout.tsx
export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
```

---

## Quick Reference

### Server Action Checklist
- [ ] Add `"use server"` at top of file or function
- [ ] Validate input with Zod
- [ ] Call `revalidatePath()` or `revalidateTag()` before `redirect()`
- [ ] Return errors as values, don't throw for expected errors

### Client Component Checklist
- [ ] Add `"use client"` only when needed
- [ ] Keep as small as possible
- [ ] Receive server data via props
- [ ] Use composition for Server Components inside Client Components

### Caching Checklist
- [ ] Use `next: { tags: ['name'] }` for granular revalidation
- [ ] Use `cache: 'no-store'` for real-time data
- [ ] Use React `cache()` for non-fetch data
- [ ] Call `revalidateTag()` in mutations

### File Conventions
| File | Purpose |
|------|---------|
| `page.tsx` | Route UI |
| `layout.tsx` | Shared layout |
| `loading.tsx` | Loading UI |
| `error.tsx` | Error boundary |
| `not-found.tsx` | 404 UI |
| `route.ts` | API endpoint |
| `default.tsx` | Parallel route fallback |



## Resources
- [Next.js Documentation](https://nextjs.org)