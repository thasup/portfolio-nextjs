'use client';

import { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Article, ArticleCategory } from '@/types/article';
import { cn } from '@/lib/utils';
import { parseMarkdown, buildHierarchicalToc, type TocItem } from '@/lib/markdownParser';

interface ArticleContentProps {
  article: Article;
  locale: string;
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

export function ArticleContent({ article, locale }: ArticleContentProps) {
  const t = useTranslations('articles');
  const [activeSection, setActiveSection] = useState<string>('');
  const [hoveredTimeline, setHoveredTimeline] = useState(false);
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Collect all timeline events for left sidebar
  const allTimelineEvents = article.sections
    .flatMap((section, sectionIdx) => 
      (section.timeline || []).map((event, eventIdx) => ({
        ...event,
        sectionId: section.id,
        globalIndex: sectionIdx * 1000 + eventIdx,
      }))
    )
    .sort((a, b) => Math.abs(b.year) - Math.abs(a.year));

  // Build hierarchical TOC
  const tocItems = buildHierarchicalToc(article.sections);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <article className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${article.heroImage.src})` }}
        >
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-background" />
        </div>
        
        <div className="relative h-full mx-auto max-w-6xl px-4 sm:px-6 flex flex-col justify-end pb-12">
          <div className="space-y-4">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
              {article.category}
            </span>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {article.title}
            </h1>
            
            {article.subtitle && (
              <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl">
                {article.subtitle}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-300">
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
                {new Date(article.publishedDate).toLocaleDateString(locale, {
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

      {/* Main Content Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex gap-6 lg:gap-8 relative">
          {/* Left Timeline - Desktop Only - Clean Expandable Sidebar */}
          <aside 
            className="hidden lg:block shrink-0 transition-all duration-300 ease-out overflow-visible"
            style={{ width: hoveredTimeline ? '280px' : '80px' }}
            onMouseEnter={() => setHoveredTimeline(true)}
            onMouseLeave={() => setHoveredTimeline(false)}
            ref={timelineRef}
          >
            <div className="sticky top-28 h-[calc(100vh-10rem)]">
              {/* Vertical Line */}
              <div 
                className="absolute top-8 bottom-8 transition-all duration-300"
                style={{ left: hoveredTimeline ? '24px' : '50%', transform: hoveredTimeline ? 'none' : 'translateX(-50%)' }}
              >
                <div className="w-px h-full bg-linear-to-b from-transparent via-border to-transparent" />
              </div>
              
              {/* Timeline Events Container */}
              <div className="relative h-full py-8 flex flex-col gap-12 overflow-y-auto scrollbar-hide">
                {allTimelineEvents.map((event, idx) => {
                  const isActive = activeSection === event.sectionId;
                  
                  return (
                    <div
                      key={idx}
                      className="relative transition-all duration-300"
                      style={{ 
                        paddingLeft: hoveredTimeline ? '48px' : '0',
                        textAlign: hoveredTimeline ? 'left' : 'center'
                      }}
                    >
                      {/* Dot Indicator */}
                      <button
                        onClick={() => scrollToSection(event.sectionId)}
                        className={cn(
                          "absolute transition-all duration-300 rounded-full",
                          "flex items-center justify-center group cursor-pointer",
                          "border-2",
                          hoveredTimeline ? "left-0 top-0" : "left-1/2 -translate-x-1/2 top-0",
                          isActive 
                            ? "w-12 h-12 bg-primary border-primary shadow-xl shadow-primary/30" 
                            : "w-10 h-10 bg-background border-border hover:border-primary hover:scale-105"
                        )}
                        aria-label={`${event.year} ${event.era}: ${event.title}`}
                      >
                        <div className={cn(
                          "rounded-full transition-all",
                          isActive ? "w-3 h-3 bg-primary-foreground" : "w-2 h-2 bg-muted-foreground"
                        )} />
                      </button>
                      
                      {/* Compact View - Year Only */}
                      {!hoveredTimeline && (
                        <div className="pt-14">
                          <div className={cn(
                            "text-xs font-bold tracking-tight transition-colors leading-tight",
                            isActive ? "text-primary" : "text-muted-foreground"
                          )}>
                            {Math.abs(event.year)}
                          </div>
                          {event.era && (
                            <div className="text-[9px] text-muted-foreground/60 mt-0.5 uppercase">
                              {event.era}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Expanded View - Full Details */}
                      {hoveredTimeline && (
                        <button
                          onClick={() => scrollToSection(event.sectionId)}
                          className={cn(
                            "w-full text-left pl-16 pr-3 py-3 rounded-lg transition-all",
                            "hover:bg-muted/50 cursor-pointer group",
                            isActive && "bg-primary/5"
                          )}
                        >
                          <div className="space-y-1.5">
                            {/* Year + Era */}
                            <div className="flex items-baseline gap-2">
                              <span className={cn(
                                "text-xl font-bold tracking-tight leading-none",
                                isActive ? "text-primary" : "text-foreground"
                              )}>
                                {Math.abs(event.year)}
                              </span>
                              {event.era && (
                                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                  {event.era}
                                </span>
                              )}
                            </div>
                            
                            {/* Event Title */}
                            <h4 className={cn(
                              "text-sm font-semibold leading-snug line-clamp-2",
                              isActive ? "text-primary" : "text-foreground group-hover:text-primary"
                            )}>
                              {event.title}
                            </h4>
                          </div>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main Article Content */}
          <div ref={contentRef} className="flex-1 min-w-0">
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-24">
              {article.sections.map((section, index) => (
                <section key={section.id} id={section.id} className="mb-16">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-foreground">
                    {section.title}
                  </h2>
                  
                  {/* Render content with markdown parsing */}
                  <div className="space-y-4 text-foreground/90 leading-relaxed">
                    {section.content.split('\n\n').map((paragraph, pIdx) => {
                      if (paragraph.trim()) {
                        return (
                          <p 
                            key={pIdx} 
                            className="text-base sm:text-lg"
                            dangerouslySetInnerHTML={{ __html: parseMarkdown(paragraph) }}
                          />
                        );
                      }
                      return null;
                    })}
                  </div>

                  {/* Mobile Timeline - Inline */}
                  {section.timeline && section.timeline.length > 0 && (
                    <div className="my-8 lg:my-12 border-l-4 border-primary/30 pl-6 sm:pl-8 space-y-6 sm:space-y-8">
                      <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-primary">
                        Timeline
                      </h3>
                      {section.timeline.map((event, idx) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-[34px] sm:-left-[42px] w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary border-4 border-background" />
                          <div className="space-y-2">
                            <div className="flex items-baseline gap-2 sm:gap-3">
                              <time className="text-xl sm:text-2xl font-bold text-primary">
                                {Math.abs(event.year)}
                              </time>
                              {event.era && (
                                <span className="text-xs sm:text-sm text-muted-foreground">{event.era}</span>
                              )}
                            </div>
                            <h4 className="text-base sm:text-lg font-semibold">{event.title}</h4>
                            <p className="text-sm sm:text-base text-muted-foreground">{event.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Images */}
                  {section.images && section.images.length > 0 && (
                    <div className="my-8 lg:my-12 grid gap-6 sm:gap-8">
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

          {/* Right Table of Contents - Desktop Only - Hierarchical */}
          <aside className="hidden xl:block w-64 shrink-0">
            <div className="sticky top-36">
              <nav className="bg-card rounded-lg border p-4 sm:p-6 shadow-sm">
                <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">
                  {t('contents')}
                </h3>
                <ul className="space-y-1 text-sm">
                  {tocItems.map((item) => (
                    <li key={item.id}>
                      {/* Main Section */}
                      <button
                        onClick={() => scrollToSection(item.id)}
                        className={cn(
                          "text-left w-full transition-colors py-1.5 font-medium",
                          activeSection === item.id
                            ? "text-primary"
                            : "text-foreground hover:text-primary"
                        )}
                      >
                        {item.title}
                      </button>
                      
                      {/* Sub-sections (if any) */}
                      {item.children && item.children.length > 0 && (
                        <ul className="mt-1 space-y-1 pl-3 border-l-2 border-border/50">
                          {item.children.map((child) => (
                            <li key={child.id}>
                              <button
                                onClick={() => scrollToSection(child.id)}
                                className={cn(
                                  "text-left w-full transition-colors py-1 text-xs line-clamp-2",
                                  activeSection === child.id
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-primary"
                                )}
                                style={{ paddingLeft: `${(child.level - 2) * 0.5}rem` }}
                              >
                                {child.title}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
