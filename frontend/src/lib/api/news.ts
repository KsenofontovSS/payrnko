import type { NewsArticle, StrapiEntity, StrapiPagination } from '@/types/api';
import { fetchAPI } from './client';

interface GetNewsParams {
  locale: string;
  page?: number;
  pageSize?: number;
  category?: string;
}

export async function getNewsArticles(params: GetNewsParams): Promise<{
  articles: NewsArticle[];
  pagination: StrapiPagination;
}> {
  const { locale, page = 1, pageSize = 10, category } = params;

  const queryParams: Record<string, string | number | boolean | undefined> = {
    'pagination[page]': page,
    'pagination[pageSize]': pageSize,
    'sort[0]': 'published_date:desc',
    'populate': 'cover_image,category',
  };

  if (category) {
    queryParams['filters[category][slug][$eq]'] = category;
  }

  const response = await fetchAPI<StrapiEntity<NewsArticle>[]>('/news-articles', {
    locale,
    params: queryParams,
  });

  return {
    articles: (response.data ?? []).map((item) => ({ id: item.id, ...item.attributes })),
    pagination: response.meta.pagination ?? { page: 1, pageSize: 10, pageCount: 1, total: 0 },
  };
}

export async function getNewsBySlug(
  slug: string,
  locale: string,
): Promise<NewsArticle | null> {
  const response = await fetchAPI<StrapiEntity<NewsArticle>[]>('/news-articles', {
    locale,
    params: {
      'filters[slug][$eq]': slug,
      'populate': 'cover_image,category',
    },
  });
  const item = response.data?.[0];
  return item ? { id: item.id, ...item.attributes } : null;
}

export async function getLatestNews(
  locale: string,
  count: number = 3,
): Promise<NewsArticle[]> {
  const response = await fetchAPI<StrapiEntity<NewsArticle>[]>('/news-articles', {
    locale,
    params: {
      'pagination[pageSize]': count,
      'sort[0]': 'published_date:desc',
      'populate': 'cover_image,category',
    },
  });
  return (response.data ?? []).map((item) => ({ id: item.id, ...item.attributes }));
}
