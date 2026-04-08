export enum ArticleCategory {
  HISTORY = 'history',
  TECHNOLOGY = 'technology',
  CULTURE = 'culture',
  SCIENCE = 'science',
}

export interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  era?: string;
}

export interface ArticleImage {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
}

export interface ArticleSection {
  id: string;
  title: string;
  content: string;
  images?: ArticleImage[];
  timeline?: TimelineEvent[];
}

export interface Article {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  category: ArticleCategory;
  tags?: string[];
  publishedDate: string;
  readingTime: number;
  heroImage: ArticleImage;
  author?: {
    name: string;
    avatar?: string;
  };
  sections: ArticleSection[];
  relatedArticles?: string[];
}
