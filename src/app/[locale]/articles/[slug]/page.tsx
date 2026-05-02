import { notFound } from "next/navigation";
import { getArticle, getAllArticleSlugs } from "@/data/articles";
import { ArticleContent } from "@/components/articles/ArticleContent";
import type { PageProps } from "@/types/next";

type ArticlePageProps = PageProps<{
  locale: string;
  slug: string;
}>;

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  const locales = ["en", "th"];

  return slugs.flatMap((slug) =>
    locales.map((locale) => ({
      locale,
      slug,
    })),
  );
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { locale, slug } = await params;
  const article = getArticle(slug, locale);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  const keywords = [
    article.category,
    ...(article.tags || []),
    locale === "th" ? "บทความ" : "article",
    locale === "th" ? "ประวัติศาสตร์" : "history",
  ].join(", ");

  return {
    title: `${article.title} | Articles`,
    description: article.description,
    keywords,
    authors: article.author ? [{ name: article.author.name }] : [],
    openGraph: {
      title: article.title,
      description: article.description,
      images: [
        {
          url: article.heroImage.src,
          alt: article.heroImage.alt,
        },
      ],
      type: "article",
      publishedTime: article.publishedDate,
      authors: article.author ? [article.author.name] : [],
      section: article.category,
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [article.heroImage.src],
    },
    alternates: {
      canonical: `/articles/${slug}`,
      languages: {
        en: `/en/articles/${slug}`,
        th: `/th/articles/${slug}`,
      },
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale, slug } = await params;
  const article = getArticle(slug, locale);

  if (!article) {
    notFound();
  }

  return <ArticleContent article={article} locale={locale} />;
}
