import type { CompanyInfo, SiteSettings } from '@/types/api';
import { fetchAPI } from './client';

export async function getCompanyInfo(): Promise<CompanyInfo> {
  const response = await fetchAPI<{ attributes: CompanyInfo }>('/company-info');
  return response.data?.attributes ?? ({} as CompanyInfo);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const response = await fetchAPI<{ attributes: SiteSettings }>('/site-settings', {
    params: { 'populate': 'logo,logo_footer,favicon' },
  });
  return response.data?.attributes ?? ({} as SiteSettings);
}
