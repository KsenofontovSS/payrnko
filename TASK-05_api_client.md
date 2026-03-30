# TASK-05: API-клиент и типизация данных

## Метаданные
- **ID:** TASK-05
- **Приоритет:** Критический
- **Роли:** Frontend-разработчик
- **Зависимости:** TASK-04 (CMS настроена)
- **Оценка:** 2–3 дня

---

## Цель

Создать типизированный API-клиент для взаимодействия Next.js с Strapi CMS. Все запросы типизированы, ответы валидируются, ошибки обрабатываются единообразно. Данные получаются через Server Components с ISR-ревалидацией.

---

## Что нужно сделать

### 1. TypeScript типы (`src/types/`)

```typescript
// src/types/api.ts

// Базовые типы Strapi
interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiEntity<T> {
  id: number;
  attributes: T;
}

// Типы контента
interface Service {
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  icon_name: string;
  order: number;
  locale: 'ru' | 'en';
}

interface NewsArticle {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: StrapiMedia | null;
  category: StrapiRelation<NewsCategory>;
  published_date: string;
  locale: 'ru' | 'en';
  is_featured: boolean;
}

interface NewsCategory {
  name: string;
  slug: string;
}

interface Document {
  title: string;
  category: 'financial' | 'standards' | 'audit' | 'risks' | 'charter' | 'tariffs' | 'other';
  file: StrapiMedia;
  published_date: string;
  year: number;
  description: string;
  order: number;
}

interface Tariff {
  service_name: string;
  category: string;
  description: string;
  price: string;
  currency: string;
  effective_date: string;
  order: number;
  locale: 'ru' | 'en';
}

interface TeamMember {
  full_name: string;
  position: string;
  bio: string;
  photo: StrapiMedia | null;
  order: number;
}

interface CompanyInfo {
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

interface SiteSettings {
  site_name: string;
  site_description: string;
  logo: StrapiMedia;
  tariffs_last_updated: string;
  maintenance_mode: boolean;
}

// Форма обратной связи
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  consent: boolean;
  captchaToken: string;
}

interface ContactFormResponse {
  success: boolean;
  error?: string;
}
```

### 2. API-клиент (`src/lib/api.ts`)

```typescript
// Базовый fetch-wrapper
const API_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:1337';

async function fetchAPI<T>(
  endpoint: string,
  options?: {
    params?: Record<string, string>;
    revalidate?: number;
    locale?: string;
  }
): Promise<StrapiResponse<T>> {
  // 1. Построить URL с query params
  // 2. Добавить locale фильтр если передан
  // 3. fetch с next: { revalidate: options.revalidate ?? 60 }
  // 4. Обработка ошибок (4xx, 5xx)
  // 5. Типизированный return
}
```

### 3. API-функции (`src/lib/api/`)

Каждая функция — отдельный файл:

```typescript
// src/lib/api/services.ts
export async function getServices(locale: string): Promise<Service[]>
export async function getServiceBySlug(slug: string, locale: string): Promise<Service | null>

// src/lib/api/news.ts
export async function getNewsArticles(params: {
  locale: string;
  page?: number;
  pageSize?: number;
  category?: string;
}): Promise<{ articles: NewsArticle[]; pagination: PaginationMeta }>
export async function getNewsBySlug(slug: string, locale: string): Promise<NewsArticle | null>
export async function getLatestNews(locale: string, count?: number): Promise<NewsArticle[]>

// src/lib/api/documents.ts
export async function getDocuments(params: {
  category?: string;
  year?: number;
}): Promise<Document[]>

// src/lib/api/tariffs.ts
export async function getTariffs(locale: string): Promise<Tariff[]>

// src/lib/api/team.ts
export async function getTeamMembers(locale: string): Promise<TeamMember[]>

// src/lib/api/company.ts
export async function getCompanyInfo(): Promise<CompanyInfo>
export async function getSiteSettings(): Promise<SiteSettings>

// src/lib/api/contact.ts
export async function submitContactForm(data: ContactFormData): Promise<ContactFormResponse>
```

### 4. Обработка ошибок

```typescript
// src/lib/api/errors.ts
class APIError extends Error {
  status: number;
  constructor(message: string, status: number) { ... }
}

// При 404 — возвращать null (для notFound() в Next.js)
// При 5xx — throw APIError (перехватывается error.tsx)
// При network error — throw с понятным сообщением
```

### 5. Хелперы

```typescript
// src/lib/utils/formatDate.ts
export function formatDate(date: string, locale: string): string
// "2025-03-15" → "15 марта 2025" (ru) / "March 15, 2025" (en)

// src/lib/utils/getStrapiMediaUrl.ts
export function getStrapiMediaUrl(media: StrapiMedia): string
// Полный URL к файлу в S3

// src/lib/utils/sanitizeHtml.ts
export function sanitizeHtml(html: string): string
// Очистка Rich Text контента от XSS
```

---

## Критерии приёмки

- [ ] Все типы определены и не используют `any`
- [ ] API-клиент получает данные из Strapi и возвращает типизированные объекты
- [ ] ISR ревалидация настроена (revalidate: 60)
- [ ] Ошибки обрабатываются: 404 → null, 5xx → throw, network → throw
- [ ] Все API-функции работают с locale-параметром
- [ ] `submitContactForm` отправляет POST и обрабатывает ответ
- [ ] Хелперы корректно форматируют даты и URL

---

## Тестирование

### Unit-тесты
- Каждая API-функция: мок fetch, проверка корректного URL, params, headers
- Обработка ошибок: 404 → null, 500 → APIError
- `formatDate`: RU и EN форматы, edge cases (невалидная дата)
- `getStrapiMediaUrl`: формирование полного URL
- `sanitizeHtml`: удаление script-тегов, onclick-атрибутов

### Integration-тесты
- API-клиент → реальный Strapi (docker): получить список услуг
- Фильтрация документов: category + year
- Пагинация новостей: page=1, pageSize=3

### E2E-тесты
```
e2e/api-integration.spec.ts:

1. Главная страница загружает и отображает услуги из CMS
2. Страница новостей показывает статьи с корректными датами
3. Детальная страница новости отображает контент из CMS
4. Страница тарифов показывает актуальные данные
```
