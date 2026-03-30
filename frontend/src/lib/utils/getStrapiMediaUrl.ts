import type { StrapiMedia } from '@/types/api';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:1337';

export function getStrapiMediaUrl(media: StrapiMedia): string {
  const url = media?.data?.attributes?.url;
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${CMS_URL}${url}`;
}
