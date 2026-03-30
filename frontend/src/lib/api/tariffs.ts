import type { Tariff, StrapiEntity } from '@/types/api';
import { fetchAPI } from './client';

export async function getTariffs(locale: string): Promise<Tariff[]> {
  const response = await fetchAPI<StrapiEntity<Tariff>[]>('/tariffs', {
    locale,
    params: { 'sort[0]': 'order:asc' },
  });
  return (response.data ?? []).map((item) => ({ id: item.id, ...item.attributes }));
}
