// Базовые типы Strapi
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: StrapiPagination;
  };
}

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiEntity<T> {
  id: number;
  attributes: T;
}

export interface StrapiMedia {
  data: {
    id: number;
    attributes: {
      url: string;
      name: string;
      alternativeText: string | null;
      width: number;
      height: number;
      formats: Record<string, { url: string; width: number; height: number }>;
    };
  } | null;
}

export interface StrapiRelation<T> {
  data: StrapiEntity<T> | null;
}

// Контент-типы
export interface Service {
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  icon_name: string;
  order: number;
  locale: 'ru' | 'en';
}

export interface NewsArticle {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: StrapiMedia;
  category: StrapiRelation<NewsCategory>;
  published_date: string;
  locale: 'ru' | 'en';
  is_featured: boolean;
}

export interface NewsCategory {
  name: string;
  slug: string;
}

export type DocumentCategory =
  | 'financial'
  | 'standards'
  | 'audit'
  | 'risks'
  | 'charter'
  | 'tariffs'
  | 'other';

export interface Document {
  title: string;
  category: DocumentCategory;
  file: StrapiMedia;
  published_date: string;
  year: number;
  description: string;
  order: number;
}

export interface Tariff {
  service_name: string;
  category: string;
  description: string;
  price: string;
  currency: string;
  effective_date: string;
  order: number;
  locale: 'ru' | 'en';
}

export interface TeamMember {
  full_name: string;
  position: string;
  bio: string;
  photo: StrapiMedia;
  order: number;
  locale: 'ru' | 'en';
}

export interface CompanyInfo {
  phone: string;
  email: string;
  address: string;
  working_hours: string;
  inn: string;
  ogrn: string;
  license_number: string;
  charter_capital: string;
  legal_address: string;
  map_coordinates: { lat: number; lng: number };
}

export interface SiteSettings {
  site_name: string;
  site_description: string;
  logo: StrapiMedia;
  logo_footer: StrapiMedia;
  favicon: StrapiMedia;
  tariffs_last_updated: string;
  maintenance_mode: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  consent: boolean;
  captchaToken: string;
}

export interface ContactFormResponse {
  success: boolean;
  error?: string;
}

export interface Page {
  title: string;
  slug: string;
  content: string;
  seo_title: string;
  seo_description: string;
  og_image: StrapiMedia;
  locale: 'ru' | 'en';
}
