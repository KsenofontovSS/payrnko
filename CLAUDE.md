# CLAUDE.md — Правила проекта РНКО «Простые платежные решения»

## Обзор проекта

Корпоративный веб-сайт РНКО «Простые платежные решения» (ООО). Расчётная небанковская кредитная организация, рег. номер ЦБ РФ: 3566. Сайт подчиняется регуляторным требованиям ЦБ РФ (ФЗ-395-1, Указание № 2172-У, Положение № 851-П).

---

## Технологический стек

### Frontend
- **Next.js 14.x+** (App Router) — SSR/SSG/ISR
- **React 18.x+** — UI-библиотека
- **TypeScript 5.x+** — строгая типизация (`strict: true`)
- **Tailwind CSS 3.x+** — стилизация
- **Framer Motion 11.x+** — анимации
- **React Hook Form 7.x+** — формы
- **next-intl** — интернационализация (RU / EN)

### Backend / CMS
- **Strapi 4.x+** (Headless CMS)
- **Node.js 20 LTS**
- **PostgreSQL 16.x+**
- **Redis 7.x+**

### Инфраструктура
- **Docker + Docker Compose**
- **Nginx** — реверс-прокси
- **GitLab CI/CD**
- Хостинг: Яндекс.Облако / VK Cloud / Selectel (территория РФ)

---

## Структура проекта

```
rnko-ppr-website/
├── frontend/                  # Next.js приложение
│   ├── src/
│   │   ├── app/               # App Router (страницы)
│   │   │   ├── [locale]/      # i18n роутинг
│   │   │   │   ├── page.tsx              # Главная
│   │   │   │   ├── about/
│   │   │   │   ├── services/
│   │   │   │   ├── tariffs/
│   │   │   │   ├── disclosure/
│   │   │   │   ├── compliance/
│   │   │   │   ├── news/
│   │   │   │   ├── contacts/
│   │   │   │   ├── privacy/
│   │   │   │   └── sitemap/
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ui/            # Базовые UI-компоненты (Button, Card, Icon...)
│   │   │   ├── layout/        # Header, Footer, Navigation, MobileMenu
│   │   │   ├── sections/      # Hero, ServiceCards, TrustBar, NewsPreview...
│   │   │   ├── forms/         # ContactForm, CookieBanner
│   │   │   └── accessibility/ # AccessibilityPanel, HighContrastWrapper
│   │   ├── lib/               # Утилиты, API-клиент, хелперы
│   │   ├── hooks/             # Кастомные React-хуки
│   │   ├── types/             # TypeScript типы и интерфейсы
│   │   ├── styles/            # Глобальные стили, Tailwind конфигурация
│   │   ├── i18n/              # Словари переводов (ru.json, en.json)
│   │   └── constants/         # Конфиги, палитра, breakpoints
│   ├── public/                # Статика (favicon, robots.txt, SVG-спрайт)
│   ├── __tests__/             # Тесты
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   ├── tailwind.config.ts
│   ├── next.config.js
│   └── tsconfig.json
├── cms/                       # Strapi CMS
│   ├── src/
│   │   ├── api/               # Content Types
│   │   └── plugins/
│   ├── config/
│   └── database/
├── docker/
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   ├── frontend/Dockerfile
│   └── cms/Dockerfile
├── nginx/
│   ├── nginx.conf
│   └── security-headers.conf
├── .gitlab-ci.yml
├── CLAUDE.md                  # ЭТО ФАЙЛ
└── docs/                      # Проектная документация
    └── tasks/                 # Промпты задач
```

---

## Правила кодирования

### Общие
- Весь код на **TypeScript** с `strict: true`. Никаких `any` без обоснования.
- Имена файлов компонентов — **PascalCase** (`HeroSection.tsx`), утилит — **camelCase** (`formatDate.ts`).
- Каждый компонент в отдельном файле. Экспорт — **named export** (не default), кроме страниц Next.js.
- Комментарии в коде — на **русском** для бизнес-логики, на **английском** для технических пометок.
- Максимальная длина файла компонента — **250 строк**. Если больше, декомпозируй.

### React / Next.js
- Использовать **App Router** (не Pages Router).
- Server Components по умолчанию. `'use client'` только при необходимости (хуки, события, анимации).
- Данные из CMS получать через серверные компоненты и `fetch` с `next: { revalidate: 60 }`.
- Изображения через `next/image` с обязательными `width`, `height`, `alt`.
- Ссылки через `next/link`.

### Стилизация
- **Tailwind CSS** — основной способ стилизации.
- Кастомные значения определять в `tailwind.config.ts` (не inline arbitrary values без причины).
- Цветовая палитра из дизайн-спецификации вынесена в конфиг Tailwind (секция `colors`).
- Не использовать `!important`. Не использовать `@apply` без крайней необходимости.
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`.

### Анимации
- **Framer Motion** для entrance-анимаций и интерактивных элементов.
- CSS transitions — для hover/focus состояний.
- Обязательно: `@media (prefers-reduced-motion: reduce)` — отключение всех анимаций.
- Стандартный easing: `cubic-bezier(0.4, 0, 0.2, 1)`.
- Длительность: 200–300ms микровзаимодействия, 500–800ms entrance.

### Формы
- **React Hook Form** + **Zod** для валидации.
- Все формы доступны с клавиатуры и скринридером.
- Сообщения об ошибках — на языке интерфейса (i18n).

### Доступность (a11y)
- **WCAG 2.1 AA** — минимальный уровень.
- Семантический HTML: `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`.
- Все изображения имеют `alt`. Декоративные — `alt=""` и `aria-hidden="true"`.
- Фокус-индикатор виден для всех интерактивных элементов.
- Контраст текста: не менее 4.5:1 (обычный текст), 3:1 (крупный).
- `aria-label` для иконок-кнопок и навигации.

### SEO
- Каждая страница: уникальный `<title>`, `<meta description>`, Open Graph теги.
- Микроразметка Schema.org: `Organization`, `ContactPoint`, `BreadcrumbList`.
- `sitemap.xml` генерируется автоматически.
- Канонические URL через `<link rel="canonical">`.

### Безопасность
- HTTP-заголовки: CSP, HSTS, X-Frame-Options, X-Content-Type-Options.
- Все пользовательские данные санитизировать.
- Капча на всех формах (hCaptcha).
- Rate limiting на API-эндпоинтах.
- Никаких секретов в коде — только через `.env`.

---

## Правила тестирования

### Unit-тесты (Jest + React Testing Library)
- Покрытие: **>80%** для компонентов, **>90%** для утилит.
- Каждый UI-компонент имеет тест на рендеринг и основные состояния.
- Утилиты и хелперы покрыты тестами на все ветки.

### Интеграционные тесты
- API-клиент тестируется с мок-данными.
- Формы тестируются с валидацией и отправкой.
- i18n — проверка переключения языков и отображения переводов.

### E2E-тесты (Playwright)
- Покрытие всех критических пользовательских сценариев.
- Тесты запускаются на Chrome, Firefox, Safari (WebKit).
- Мобильное разрешение (375px) и десктопное (1280px).
- **Обязательные E2E-сценарии:**
  1. Навигация по всем страницам (ссылки работают, 404 не возникает)
  2. Мобильное меню (открытие, навигация, закрытие)
  3. Отправка формы обратной связи (валидация + успех + ошибка)
  4. Скачивание PDF-документа из раздела раскрытия
  5. Переключение языка (RU ↔ EN) с сохранением страницы
  6. Включение версии для слабовидящих (шрифт, контраст)
  7. Пагинация новостей и переход к детальной новости
  8. Фильтрация тарифов по категории
  9. Cookie-баннер: появление, принятие, запоминание
  10. SEO-проверка: наличие meta-тегов, OG-тегов, заголовков

### Accessibility-тесты
- **axe-core** интегрирован в CI — нулевая толерантность к critical/serious.
- Lighthouse Accessibility: **>90** баллов.

### Performance-тесты
- Lighthouse Performance: **>90** баллов (mobile).
- LCP < 2.5s, FID < 100ms, CLS < 0.1.

---

## Git-конвенции

### Ветки
- `main` — продакшн
- `develop` — основная ветка разработки
- `feature/TASK-XX-описание` — фичи
- `fix/TASK-XX-описание` — багфиксы
- `hotfix/описание` — срочные фиксы в продакшн

### Коммиты
Формат: `type(scope): описание`

Типы: `feat`, `fix`, `style`, `refactor`, `test`, `docs`, `chore`, `perf`

Примеры:
```
feat(header): добавить sticky-навигацию с тенью при скролле
fix(disclosure): исправить фильтрацию документов по году
test(contacts): e2e-тест отправки формы обратной связи
```

### Code Review
- Каждый PR проходит ревью минимум одним разработчиком.
- CI должен быть зелёным (линтинг, тесты, сборка).
- Перед мержем — сквош коммитов.

---

## Переменные окружения (.env.example)

```env
# Frontend
NEXT_PUBLIC_SITE_URL=https://ppr-rnko.ru
NEXT_PUBLIC_CMS_URL=http://localhost:1337
NEXT_PUBLIC_YANDEX_MAPS_API_KEY=
NEXT_PUBLIC_YANDEX_METRIKA_ID=
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=
NEXT_PUBLIC_DEFAULT_LOCALE=ru

# CMS (Strapi)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=
REDIS_URL=redis://localhost:6379
S3_ENDPOINT=
S3_BUCKET=
S3_ACCESS_KEY=
S3_SECRET_KEY=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

---

## Запуск проекта

```bash
# Разработка
docker-compose up -d postgres redis
cd frontend && npm install && npm run dev
cd cms && npm install && npm run develop

# Продакшн
docker-compose -f docker-compose.prod.yml up -d
```

---

## Полезные команды

```bash
# Линтинг
npm run lint

# Тесты
npm run test              # Unit + Integration
npm run test:e2e          # E2E (Playwright)
npm run test:a11y         # Accessibility audit

# Сборка
npm run build
npm run start

# Генерация типов из CMS
npm run generate:types
```
