import type { Document, StrapiEntity } from '@/types/api';
import { fetchAPI } from './client';

interface GetDocumentsParams {
  category?: string;
  year?: number;
}

export async function getDocuments(params: GetDocumentsParams = {}): Promise<Document[]> {
  const { category, year } = params;

  const queryParams: Record<string, string | number | boolean | undefined> = {
    'sort[0]': 'order:asc',
    'populate': 'file',
  };

  if (category) {
    queryParams['filters[category][$eq]'] = category;
  }

  if (year) {
    queryParams['filters[year][$eq]'] = year;
  }

  const response = await fetchAPI<StrapiEntity<Document>[]>('/documents', {
    params: queryParams,
  });

  return (response.data ?? []).map((item) => ({ id: item.id, ...item.attributes }));
}
