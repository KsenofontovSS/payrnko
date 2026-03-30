# TASK-04: Настройка Strapi CMS — контент-типы, роли, медиа

## Метаданные
- **ID:** TASK-04
- **Приоритет:** Критический
- **Роли:** Backend-разработчик
- **Зависимости:** TASK-01
- **Оценка:** 4–5 дней

---

## Цель

Настроить Strapi Headless CMS: создать все Content Types для страниц сайта, настроить ролевую модель доступа, подключить S3-хранилище для документов, настроить Redis-кэширование и журнал аудита.

---

## Что нужно сделать

### 1. Content Types (Collection Types)

#### 1.1. `Page` — Статические страницы
```
fields:
  - title: String (required)
  - slug: UID (based on title, required, unique)
  - content: Rich Text (required)
  - seo_title: String
  - seo_description: Text
  - og_image: Media (single)
  - locale: Enumeration [ru, en]
  - published_at: DateTime
```

#### 1.2. `Service` — Услуги
```
fields:
  - title: String (required)
  - slug: UID (required, unique)
  - short_description: Text (max 200 chars)
  - full_description: Rich Text
  - icon_name: String (имя Lucide-иконки, например "CreditCard")
  - order: Integer (для сортировки)
  - locale: Enumeration [ru, en]
```

#### 1.3. `NewsArticle` — Новости
```
fields:
  - title: String (required)
  - slug: UID (required, unique)
  - excerpt: Text (max 300 chars)
  - content: Rich Text (required)
  - cover_image: Media (single)
  - category: Relation → NewsCategory (many-to-one)
  - published_date: Date (required)
  - locale: Enumeration [ru, en]
  - is_featured: Boolean (default: false)
```

#### 1.4. `NewsCategory` — Рубрики новостей
```
fields:
  - name: String (required)
  - slug: UID (required)
  - locale: Enumeration [ru, en]
```
Предустановленные: «Регуляторные изменения», «События компании», «Обновления тарифов».

#### 1.5. `Document` — Документы для раскрытия информации
```
fields:
  - title: String (required)
  - category: Enumeration [financial, standards, audit, risks, charter, tariffs, other]
  - file: Media (single, required) — PDF, XLSX
  - published_date: Date (required)
  - year: Integer (required) — для фильтрации
  - description: Text
  - order: Integer
```

#### 1.6. `Tariff` — Тарифы
```
fields:
  - service_name: String (required)
  - category: String (required) — для группировки
  - description: Text
  - price: String (required) — "от 500 руб.", "бесплатно", "по договорённости"
  - currency: String (default: "RUB")
  - effective_date: Date (required)
  - order: Integer
  - locale: Enumeration [ru, en]
```

#### 1.7. `TeamMember` — Руководство
```
fields:
  - full_name: String (required)
  - position: String (required)
  - bio: Text
  - photo: Media (single)
  - order: Integer
  - locale: Enumeration [ru, en]
```

#### 1.8. `CompanyInfo` — Информация о компании (Single Type)
```
fields:
  - phone: String
  - email: String
  - address: Text
  - working_hours: String
  - inn: String
  - ogrn: String
  - license_number: String
  - charter_capital: String
  - legal_address: Text
  - map_coordinates: JSON ({lat, lng})
```

#### 1.9. `SiteSettings` — Настройки сайта (Single Type)
```
fields:
  - site_name: String
  - site_description: Text
  - logo: Media (single)
  - logo_footer: Media (single)
  - favicon: Media (single)
  - tariffs_last_updated: DateTime
  - maintenance_mode: Boolean
```

### 2. Ролевая модель

| Роль | Права |
|------|-------|
| **Администратор** | Полный доступ. Управление пользователями и ролями. |
| **Редактор** | Создание, редактирование, публикация контента. Загрузка файлов. |
| **Модератор** | Просмотр и публикация/снятие с публикации. Без удаления. |

Все действия логируются в журнал аудита.

### 3. API Endpoints

Strapi генерирует REST API автоматически. Проверить и настроить доступ:

| Endpoint | Метод | Доступ | Описание |
|----------|-------|--------|----------|
| `/api/pages` | GET | Public | Список страниц |
| `/api/pages/:slug` | GET | Public | Страница по slug |
| `/api/services` | GET | Public | Список услуг (sort: order) |
| `/api/news-articles` | GET | Public | Новости (pagination, filter) |
| `/api/news-articles/:slug` | GET | Public | Детальная новость |
| `/api/documents` | GET | Public | Документы (filter: category, year) |
| `/api/tariffs` | GET | Public | Тарифы (sort: order) |
| `/api/team-members` | GET | Public | Руководство (sort: order) |
| `/api/company-info` | GET | Public | Реквизиты компании |
| `/api/site-settings` | GET | Public | Настройки сайта |
| `/api/contact-form` | POST | Public | Отправка формы (кастомный контроллер) |

### 4. Кастомный контроллер: Форма обратной связи

Endpoint: `POST /api/contact-form`

```typescript
// Входные данные
interface ContactFormInput {
  name: string;         // required, 2–100 chars
  email: string;        // required, valid email
  subject: string;      // required, 5–200 chars
  message: string;      // required, 10–5000 chars
  consent: boolean;     // required, must be true
  captchaToken: string; // required, hCaptcha token
}
```

Логика:
1. Валидация входных данных (Zod или Joi)
2. Верификация hCaptcha токена через API
3. Rate limiting: 3 заявки с одного IP в час
4. Сохранение в БД (Content Type `ContactSubmission`)
5. Отправка email-уведомления на корпоративную почту (SMTP)
6. Возврат `{ success: true }` или `{ error: "..." }`

### 5. S3 Storage

Подключить S3-совместимое хранилище (Yandex Object Storage / MinIO для dev):
- Все загруженные файлы (PDF, изображения) хранятся в S3
- Настроить плагин `@strapi/provider-upload-aws-s3`
- Bucket policy: публичный read для документов

### 6. Redis Cache

- Кэширование популярных API-запросов (services, tariffs, company-info)
- TTL: 60 секунд (совпадает с ISR-ревалидацией Next.js)
- Инвалидация кэша при обновлении контента в CMS

### 7. Журнал аудита

- Логирование всех CRUD-операций в CMS
- Поля: пользователь, действие, content type, timestamp, IP
- Хранение: минимум 5 лет (требование ЦБ)
- Плагин: `@strapi/plugin-audit-logs` или кастомный middleware

---

## Критерии приёмки

- [ ] Все 9 Content Types созданы и доступны в админке Strapi
- [ ] API endpoints возвращают корректные данные (проверить через Postman/curl)
- [ ] Пагинация, фильтрация, сортировка работают на коллекциях
- [ ] Ролевая модель: редактор не может удалять, модератор не может создавать
- [ ] Форма обратной связи: валидация, captcha, rate limiting, email-уведомление
- [ ] Файлы загружаются в S3 и доступны по URL
- [ ] Redis кэширует и инвалидирует запросы
- [ ] Журнал аудита фиксирует все действия

---

## Тестирование

### Unit-тесты
- Валидация входных данных формы обратной связи (все edge cases)
- Rate limiter: блокировка после 3 запросов
- hCaptcha verification mock: success и failure

### Integration-тесты
- CRUD для каждого Content Type через API
- Загрузка файла → проверка URL в S3
- Создание новости → проверка появления в GET /api/news-articles
- Фильтрация документов: по category, по year

### E2E-тесты
```
e2e/cms-api.spec.ts:

1. GET /api/services → 200, массив услуг, у каждой title и slug
2. GET /api/news-articles?pagination[page]=1&pagination[pageSize]=3 → 3 новости
3. GET /api/documents?filters[category]=financial&filters[year]=2025 → отфильтрованный список
4. POST /api/contact-form с валидными данными → { success: true }
5. POST /api/contact-form без captcha → 400 error
6. POST /api/contact-form 4 раза подряд → 429 rate limit
```
