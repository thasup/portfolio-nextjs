# Next.js 15+ Params Pattern

## Overview

Next.js 15 introduced a breaking change where page `params` are now `Promise`-based instead of plain objects. This document explains how to handle this pattern consistently across the codebase.

## The Pattern

In Next.js 15+, all dynamic route parameters must be awaited:

```typescript
// ✅ CORRECT
type MyPageProps = PageProps<{ slug: string; locale: string }>;

export default async function MyPage({ params }: MyPageProps) {
  const { slug, locale } = await params;
  // Use slug and locale here
}
```

```typescript
// ❌ WRONG (Old Next.js 14 pattern)
interface MyPageProps {
  params: {
    slug: string;
    locale: string;
  };
}

export default async function MyPage({ params }: MyPageProps) {
  // This will fail - params is a Promise, not an object
  console.log(params.slug);
}
```

## Using the PageProps Utility Type

The `@/types/next` module provides a reusable `PageProps` type that handles the Promise pattern:

```typescript
import type { PageProps } from '@/types/next';

// For pages with dynamic segments
type ArticlePageProps = PageProps<{
  locale: string;
  slug: string;
}>;

export async function generateMetadata({ params }: ArticlePageProps) {
  const { locale, slug } = await params;
  // ...
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale, slug } = await params;
  // ...
}
```

## For generateMetadata

Always await params in `generateMetadata`:

```typescript
export async function generateMetadata({ params }: PageProps<{ slug: string }>) {
  const { slug } = await params;
  // Use slug to fetch metadata
}
```

## For generateStaticParams

`generateStaticParams` does NOT use Promise params - return plain objects:

```typescript
export async function generateStaticParams() {
  return [
    { slug: 'article-1', locale: 'en' },
    { slug: 'article-1', locale: 'th' },
  ];
}
```

## searchParams

If your page uses `searchParams`, they are also Promises:

```typescript
type PageProps<T> = {
  params: Promise<T>;
  searchParams?: Promise<Record<string, string | string[]>>;
};

export default async function Page({ searchParams }: PageProps<{}>) {
  const query = await searchParams;
  // Use query here
}
```

## Summary

- Always import `PageProps` from `@/types/next`
- Always await `params` in page components and `generateMetadata`
- Use destructuring for cleaner code: `const { slug } = await params`
- Don't await in `generateStaticParams` - return plain objects
