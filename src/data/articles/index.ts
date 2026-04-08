import { Article } from '@/types/article';
import { emperorXuanOfHanEn } from './emperor-xuan-of-han.en';
import { emperorXuanOfHanTh } from './emperor-xuan-of-han.th';

export const articles: Record<string, Record<string, Article>> = {
  'emperor-xuan-of-han': {
    en: emperorXuanOfHanEn,
    th: emperorXuanOfHanTh,
  },
};

export function getArticle(slug: string, locale: string): Article | undefined {
  return articles[slug]?.[locale] || articles[slug]?.['en'];
}

export function getAllArticleSlugs(): string[] {
  return Object.keys(articles);
}
