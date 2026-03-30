import type { StrapiResponse } from '@/types/api';
import { APIError } from './errors';

const API_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:1337';

interface FetchOptions {
  params?: Record<string, string | number | boolean | undefined>;
  revalidate?: number;
  locale?: string;
}

export async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<StrapiResponse<T>> {
  const { params = {}, revalidate = 60, locale } = options;

  const url = new URL(`/api${endpoint}`, API_URL);

  if (locale) {
    url.searchParams.set('locale', locale);
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString(), {
    next: { revalidate },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return { data: null as T, meta: {} };
    }
    throw new APIError(
      `API request failed: ${response.statusText}`,
      response.status,
    );
  }

  return response.json();
}

export async function postAPI<T>(
  endpoint: string,
  body: Record<string, unknown>,
): Promise<T> {
  const url = new URL(`/api${endpoint}`, API_URL);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new APIError(
      `API request failed: ${response.statusText}`,
      response.status,
    );
  }

  return response.json();
}
