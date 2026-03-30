import type { Service, StrapiEntity } from '@/types/api';
import { fetchAPI } from './client';

export async function getServices(locale: string): Promise<Service[]> {
  const response = await fetchAPI<StrapiEntity<Service>[]>('/services', {
    locale,
    params: { 'sort[0]': 'order:asc' },
  });
  return (response.data ?? []).map((item) => (item.attributes));
}

export async function getServiceBySlug(
  slug: string,
  locale: string,
): Promise<Service | null> {
  const response = await fetchAPI<StrapiEntity<Service>[]>('/services', {
    locale,
    params: { 'filters[slug][$eq]': slug },
  });
  const item = response.data?.[0];
  return item ? item.attributes : null;
}
