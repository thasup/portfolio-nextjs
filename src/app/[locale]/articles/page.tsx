import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { articles } from "@/data/articles";
import { ArticleCategory } from "@/types/article";
import type { PageProps } from "@/types/next";

type ArticlesPageProps = PageProps<{
  locale: string;
}>;

function getCategoryColor(category: ArticleCategory): string {
  const colors = {
    [ArticleCategory.HISTORY]:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    [ArticleCategory.TECHNOLOGY]:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    [ArticleCategory.CULTURE]:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    [ArticleCategory.SCIENCE]:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  };
  return colors[category];
}

export default async function ArticlesPage({ params }: ArticlesPageProps) {
  const { locale } = await params;
  const t = await getTranslations();

  const articlesList = Object.entries(articles).map(
    ([slug, localeArticles]) => ({
      slug,
      article: localeArticles[locale] || localeArticles.en,
    }),
  );

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Section Header - Matches site design system */}
        <div className="mb-16 space-y-4">
          <span className="eyebrow text-[var(--color-praxis-accent)]">
            {locale === "th" ? "คลังความรู้" : "Knowledge Hub"}
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight text-[var(--color-ink)]">
            {t("nav.articles")}
          </h1>
          <p className="text-xl text-[var(--color-ink-2)] max-w-2xl leading-relaxed">
            {locale === "th"
              ? "สำรวจบทความเชิงลึกเกี่ยวกับประวัติศาสตร์ เทคโนโลยี วัฒนธรรม และวิทยาศาสตร์"
              : "Deep-dive articles exploring history, technology, culture, and science"}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articlesList.map(({ slug, article }) => (
            <Link
              key={slug}
              href={`/${locale}/articles/${slug}`}
              className="block outline-none"
            >
              <div className="card flex flex-col h-full overflow-hidden transition-all duration-300 hover:border-[var(--color-ink-2)] group">
                <div className="aspect-video w-full overflow-hidden border-b border-[var(--color-line-soft)]">
                  <Image
                    src={article.heroImage.src}
                    alt={article.heroImage.alt}
                    width={800}
                    height={450}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>

                <div className="p-6 space-y-3 flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold ${getCategoryColor(article.category)}`}
                    >
                      {article.category}
                    </span>
                    <span className="text-xs text-[var(--color-ink-3)]">
                      {article.readingTime} min
                    </span>
                  </div>

                  <h2 className="font-display text-xl font-medium line-clamp-2 group-hover:text-[var(--color-praxis-accent)] transition-colors text-[var(--color-ink)]">
                    {article.title}
                  </h2>

                  <p className="text-sm text-[var(--color-ink-2)] line-clamp-3">
                    {article.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 mt-auto text-xs text-[var(--color-ink-3)]">
                    <time dateTime={article.publishedDate}>
                      {new Date(article.publishedDate).toLocaleDateString(
                        locale === "th" ? "th-TH" : "en-GB",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </time>
                    {article.author && <span>{article.author.name}</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
