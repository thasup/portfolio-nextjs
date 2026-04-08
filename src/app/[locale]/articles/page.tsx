import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { articles } from '@/data/articles';
import { ArticleCategory } from '@/types/article';

interface ArticlesPageProps {
  params: {
    locale: string;
  };
}

function getCategoryColor(category: ArticleCategory): string {
  const colors = {
    [ArticleCategory.HISTORY]: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    [ArticleCategory.TECHNOLOGY]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    [ArticleCategory.CULTURE]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    [ArticleCategory.SCIENCE]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  };
  return colors[category];
}

export default async function ArticlesPage({ params }: ArticlesPageProps) {
  const t = await getTranslations();
  
  const articlesList = Object.entries(articles).map(([slug, localeArticles]) => ({
    slug,
    article: localeArticles[params.locale] || localeArticles.en,
  }));

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Section Header - Matches site design system */}
        <div className="mb-16 space-y-4">
          <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {params.locale === 'th' ? 'คลังความรู้' : 'Knowledge Hub'}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t('nav.articles')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            {params.locale === 'th' 
              ? 'สำรวจบทความเชิงลึกเกี่ยวกับประวัติศาสตร์ เทคโนโลยี วัฒนธรรม และวิทยาศาสตร์'
              : 'Deep-dive articles exploring history, technology, culture, and science'}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articlesList.map(({ slug, article }) => (
            <Link
              key={slug}
              href={`/${params.locale}/articles/${slug}`}
              className="group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg"
            >
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={article.heroImage.src}
                  alt={article.heroImage.alt}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {article.readingTime} min
                  </span>
                </div>
                
                <h2 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h2>
                
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {article.description}
                </p>
                
                <div className="flex items-center justify-between pt-3 text-xs text-muted-foreground">
                  <time dateTime={article.publishedDate}>
                    {new Date(article.publishedDate).toLocaleDateString(params.locale, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                  {article.author && (
                    <span>{article.author.name}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
