import type { TeamMember, StrapiEntity } from '@/types/api';
import { fetchAPI } from './client';

export async function getTeamMembers(locale: string): Promise<TeamMember[]> {
  const response = await fetchAPI<StrapiEntity<TeamMember>[]>('/team-members', {
    locale,
    params: {
      'sort[0]': 'order:asc',
      'populate': 'photo',
    },
  });
  return (response.data ?? []).map((item) => ({ id: item.id, ...item.attributes }));
}
