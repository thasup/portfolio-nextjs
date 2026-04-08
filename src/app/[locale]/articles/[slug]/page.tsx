import { notFound } from 'next/navigation';
import { getArticle, getAllArticleSlugs } from '@/data/articles';
import { getTranslations } from 'next-intl/server';
import { ArticleCategory } from '@/types/article';

interface ArticlePageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  const locales = ['en', 'th'];
  
  return slugs.flatMap(slug => 
    locales.map(locale => ({
      locale,
      slug,
    }))
  );
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const article = getArticle(params.slug, params.locale);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      images: [article.heroImage.src],
      type: 'article',
      publishedTime: article.publishedDate,
    },
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

export default async function ArticlePage({ params }: ArticlePageProps) {
  const t = await getTranslations();
  const article = getArticle(params.slug, params.locale);

  if (!article) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${article.heroImage.src})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </div>
        
        <div className="relative h-full mx-auto max-w-4xl px-4 flex flex-col justify-end pb-12">
          <div className="space-y-4">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
              {article.category}
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {article.title}
            </h1>
            
            {article.subtitle && (
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl">
                {article.subtitle}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-300">
              {article.author && (
                <span className="flex items-center gap-2">
                  {article.author.avatar && (
                    <img 
                      src={article.author.avatar} 
                      alt={article.author.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  {article.author.name}
                </span>
              )}
              <span>•</span>
              <time dateTime={article.publishedDate}>
                {new Date(article.publishedDate).toLocaleDateString(params.locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span>•</span>
              <span>{article.readingTime} min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {article.sections.map((section, index) => (
            <section key={section.id} id={section.id} className="mb-16 scroll-mt-20">
              <h2 className="text-3xl font-bold mb-6">{section.title}</h2>
              
              <div className="whitespace-pre-line leading-relaxed text-foreground/90">
                {section.content}
              </div>

              {/* Timeline Component */}
              {section.timeline && section.timeline.length > 0 && (
                <div className="my-12 border-l-4 border-primary/30 pl-8 space-y-8">
                  <h3 className="text-xl font-semibold mb-6 text-primary">Timeline</h3>
                  {section.timeline.map((event, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[42px] w-6 h-6 rounded-full bg-primary border-4 border-background" />
                      <div className="space-y-2">
                        <div className="flex items-baseline gap-3">
                          <time className="text-2xl font-bold text-primary">
                            {Math.abs(event.year)}
                          </time>
                          {event.era && (
                            <span className="text-sm text-muted-foreground">{event.era}</span>
                          )}
                        </div>
                        <h4 className="text-lg font-semibold">{event.title}</h4>
                        <p className="text-muted-foreground">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Images */}
              {section.images && section.images.length > 0 && (
                <div className="my-12 grid gap-8">
                  {section.images.map((image, idx) => (
                    <figure key={idx} className="space-y-3">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full rounded-lg shadow-lg"
                        loading="lazy"
                      />
                      {(image.caption || image.credit) && (
                        <figcaption className="text-sm text-muted-foreground text-center">
                          {image.caption}
                          {image.credit && (
                            <span className="block mt-1 text-xs">
                              {image.credit}
                            </span>
                          )}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>

      {/* Table of Contents - Sticky Sidebar */}
      <aside className="hidden lg:block fixed top-24 right-8 w-64">
        <nav className="bg-card rounded-lg border p-6 shadow-sm">
          <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">
            Contents
          </h3>
          <ul className="space-y-2 text-sm">
            {article.sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-muted-foreground hover:text-primary transition-colors line-clamp-2"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </article>
  );
}
