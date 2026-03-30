# TASK-01: Инициализация проекта и инфраструктура

## Метаданные
- **ID:** TASK-01
- **Приоритет:** Критический
- **Роли:** DevOps, Backend-разработчик
- **Зависимости:** Нет
- **Оценка:** 3–5 дней

---

## Цель

Развернуть базовую структуру проекта: монорепозиторий с Next.js (frontend), Strapi CMS (backend), Docker-окружение для локальной разработки, конфигурацию линтинга, тестовый пайплайн CI, PostgreSQL и Redis.

---

## Что нужно сделать

### 1. Структура репозитория

Создать монорепозиторий со следующей структурой:

```
rnko-ppr-website/
├── frontend/           # Next.js 14 App Router
├── cms/                # Strapi 4 Headless CMS
├── docker/
│   ├── docker-compose.yml          # Локальная разработка
│   ├── docker-compose.prod.yml     # Продакшн
│   ├── frontend/Dockerfile
│   └── cms/Dockerfile
├── nginx/
│   ├── nginx.conf
│   └── security-headers.conf
├── .gitlab-ci.yml
├── .gitignore
├── CLAUDE.md
├── README.md
└── docs/
```

### 2. Frontend (Next.js)

```bash
npx create-next-app@14 frontend --typescript --tailwind --app --src-dir
```

Конфигурация:
- `tsconfig.json`: `strict: true`, path aliases (`@/components`, `@/lib`, `@/types`)
- `tailwind.config.ts`: кастомная палитра из дизайн-спецификации (все цвета из раздела 2), шрифты Inter и JetBrains Mono, кастомные breakpoints
- `next.config.js`: i18n конфигурация, image domains, security headers
- `.env.local` и `.env.example` с переменными (см. CLAUDE.md)
- ESLint + Prettier с единой конфигурацией
- Установить зависимости: `framer-motion`, `react-hook-form`, `zod`, `lucide-react`, `next-intl`

### 3. Tailwind конфигурация цветов

```typescript
// tailwind.config.ts — секция colors
colors: {
  navy: { primary: '#0F2B4E' },
  'deep-blue': '#1A365D',
  royal: '#2B6CB0',
  sky: { accent: '#4299E1' },
  ice: '#EBF8FF',
  charcoal: '#1A202C',
  slate: '#4A5568',
  'cool-gray': '#A0AEC0',
  silver: '#E2E8F0',
  snow: '#F7FAFC',
  success: '#38A169',
  warning: '#D69E2E',
  error: '#E53E3E',
  info: '#3182CE',
}
```

### 4. Docker Compose (разработка)

Сервисы:
- **postgres**: PostgreSQL 16, порт 5432, volume для данных
- **redis**: Redis 7, порт 6379
- **cms**: Strapi, порт 1337, зависит от postgres + redis
- **frontend**: Next.js dev, порт 3000

### 5. Docker Compose (продакшн)

Добавить:
- **nginx**: реверс-прокси, SSL-терминация, security headers
- Все сервисы с `restart: always`
- Health checks для каждого сервиса
- Ограничения ресурсов (memory limits)

### 6. Nginx конфигурация

- Реверс-прокси: `/` → frontend:3000, `/api` → cms:1337
- Security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
- Rate limiting: 10 req/s для API, 30 req/s для статики
- Gzip-сжатие
- Кэширование статики (1 год для хешированных файлов)

### 7. GitLab CI/CD (базовый)

Стейджи:
1. **lint** — ESLint + TypeScript check
2. **test** — Unit-тесты (Jest)
3. **build** — `next build` + `strapi build`
4. **e2e** — Playwright (на этом этапе заглушка)

### 8. Тестовая инфраструктура

- **Jest** + **React Testing Library**: настроить конфиг, моки для Next.js (router, image)
- **Playwright**: установить, создать базовый конфиг для Chrome, Firefox, WebKit; настроить разрешения (375px mobile, 1280px desktop)
- Папочная структура: `__tests__/unit/`, `__tests__/integration/`, `__tests__/e2e/`

---

## Критерии приёмки

- [ ] `docker-compose up` поднимает все сервисы без ошибок
- [ ] `http://localhost:3000` отдаёт стартовую страницу Next.js
- [ ] `http://localhost:1337/admin` отдаёт панель Strapi
- [ ] `npm run lint` проходит без ошибок
- [ ] `npm run test` запускает пустой тестовый suite без падений
- [ ] `npm run build` успешно собирает frontend и CMS
- [ ] CI-пайплайн проходит все стейджи (lint → test → build)
- [ ] Tailwind конфигурация содержит все цвета из палитры
- [ ] `.env.example` содержит все необходимые переменные

---

## Тестирование

### Unit-тесты
- Тест рендеринга корневого layout (`app/layout.tsx`)
- Тест загрузки Tailwind-конфигурации (цвета резолвятся)

### Integration-тесты
- Docker health check для каждого сервиса

### E2E-тесты
- `e2e/smoke.spec.ts`: стартовая страница открывается, HTTP 200, title присутствует
