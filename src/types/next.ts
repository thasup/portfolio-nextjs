/**
 * Next.js 15+ Page Props Types
 * Handles the Promise-based params pattern introduced in Next.js 15
 */

/**
 * Generic page props type for Next.js 15+ pages with dynamic segments
 * @example
 * type ArticlePageProps = PageProps<{ slug: string; locale: string }>;
 */
export type PageProps<T extends Record<string, string> = {}> = {
  params: Promise<T>;
  searchParams?: Promise<Record<string, string | string[]>>;
};

/**
 * Helper to safely extract and await params in page components
 * @example
 * const { locale, slug } = await extractParams(params);
 */
export async function extractParams<T extends Record<string, string>>(
  params: Promise<T>
): Promise<T> {
  return await params;
}

/**
 * Helper to safely extract and await searchParams in page components
 * @example
 * const query = await extractSearchParams(searchParams);
 */
export async function extractSearchParams(
  searchParams?: Promise<Record<string, string | string[]>>
): Promise<Record<string, string | string[]>> {
  if (!searchParams) return {};
  return await searchParams;
}
