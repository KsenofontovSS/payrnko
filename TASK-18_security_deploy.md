# TASK-18: Безопасность, мониторинг, CI/CD и деплой

## Метаданные
- **ID:** TASK-18
- **Приоритет:** Критический
- **Роли:** DevOps, Backend-разработчик
- **Зависимости:** Все предыдущие задачи
- **Оценка:** 5–7 дней

---

## Цель

Настроить полноценный CI/CD-пайплайн, продакшн-инфраструктуру, мониторинг, логирование, security headers, WAF, резервное копирование — в соответствии с Положением ЦБ РФ № 851-П и ГОСТ Р 57580.1-2017.

---

## Что нужно сделать

### 1. Security Headers (Nginx)

**Файл:** `nginx/security-headers.conf`

```nginx
# HSTS — обязательно для финансовых сервисов
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

# Запрет встраивания в iframe (clickjacking)
add_header X-Frame-Options "SAMEORIGIN" always;

# Блокировка MIME-sniffing
add_header X-Content-Type-Options "nosniff" always;

# XSS-фильтр (legacy, но не повредит)
add_header X-XSS-Protection "1; mode=block" always;

# Referrer Policy
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Permissions Policy
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(self), payment=()" always;

# Content Security Policy
add_header Content-Security-Policy "
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://mc.yandex.ru https://api-maps.yandex.ru https://hcaptcha.com https://*.hcaptcha.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https://*.yandex.ru https://*.yandex.net blob:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://mc.yandex.ru https://hcaptcha.com https://*.hcaptcha.com;
  frame-src https://hcaptcha.com https://*.hcaptcha.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
" always;
```

### 2. WAF и Rate Limiting (Nginx)

```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=forms:10m rate=3r/m;
limit_req_zone $binary_remote_addr zone=static:10m rate=30r/s;

server {
    location /api/contact-form {
        limit_req zone=forms burst=2 nodelay;
        proxy_pass http://cms:1337;
    }
    
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://cms:1337;
    }
    
    location / {
        limit_req zone=static burst=50 nodelay;
        proxy_pass http://frontend:3000;
    }
}
```

### 3. SSL/TLS

- Сертификат: EV или OV от GlobalSign / Let's Encrypt (на первых этапах)
- TLS 1.2+ (предпочтительно 1.3)
- OCSP Stapling
- Цепочка сертификатов корректна
- Автоматическое обновление (certbot)

### 4. Sentry — мониторинг ошибок

**Frontend:**
```typescript
// next.config.js
const { withSentryConfig } = require('@sentry/nextjs');

// sentry.client.config.ts
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% транзакций
});
```

**Backend (Strapi):**
- Middleware для перехвата ошибок
- Sentry SDK для Node.js

### 5. Логирование (ELK Stack)

**Требование ЦБ:** хранение логов минимум 5 лет.

**Компоненты:**
- **Filebeat** → сбор логов из Docker-контейнеров
- **Logstash** → обработка и фильтрация
- **Elasticsearch** → хранение и поиск
- **Kibana** → визуализация

**Что логировать:**
- Все запросы к API (метод, URL, IP, User-Agent, status code, response time)
- Действия в CMS (CRUD, пользователь, timestamp)
- Ошибки (4xx, 5xx) с деталями
- Отправка форм обратной связи (без ПД — только факт отправки)
- Попытки подбора паролей / rate limit violations

### 6. Мониторинг (Grafana + Prometheus)

**Метрики:**
- Uptime сервисов (frontend, CMS, PostgreSQL, Redis, Nginx)
- Время ответа API (p50, p95, p99)
- CPU / RAM / Disk usage
- Кол-во HTTP-ошибок (4xx, 5xx) в минуту
- Кол-во активных соединений Nginx

**Алерты:**
- Downtime любого сервиса > 1 минуты → уведомление
- CPU > 80% в течение 5 минут → предупреждение
- Disk > 90% → критическое уведомление
- Кол-во 5xx > 10/мин → уведомление

### 7. GitLab CI/CD (полный пайплайн)

**Файл:** `.gitlab-ci.yml`

```yaml
stages:
  - lint
  - test
  - build
  - e2e
  - security
  - deploy

# --- LINT ---
lint:
  stage: lint
  script:
    - cd frontend && npm ci && npm run lint
    - cd ../cms && npm ci && npm run lint

# --- UNIT TESTS ---
test:unit:
  stage: test
  script:
    - cd frontend && npm ci && npm run test -- --coverage
  coverage: '/All files.*\|.*(\d+\.\d+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: frontend/coverage/cobertura-coverage.xml

# --- BUILD ---
build:frontend:
  stage: build
  script:
    - cd frontend && npm ci && npm run build
  artifacts:
    paths:
      - frontend/.next/

build:cms:
  stage: build
  script:
    - cd cms && npm ci && npm run build

# --- E2E TESTS ---
test:e2e:
  stage: e2e
  services:
    - postgres:16
    - redis:7
  script:
    - cd frontend && npx playwright install --with-deps
    - npm run test:e2e
  artifacts:
    when: always
    paths:
      - frontend/test-results/
      - frontend/playwright-report/

# --- SECURITY SCAN ---
security:dependencies:
  stage: security
  script:
    - cd frontend && npm audit --audit-level=high
    - cd ../cms && npm audit --audit-level=high

security:docker:
  stage: security
  script:
    - trivy image rnko-frontend:latest
    - trivy image rnko-cms:latest

# --- DEPLOY ---
deploy:staging:
  stage: deploy
  environment: staging
  script:
    - docker-compose -f docker-compose.staging.yml up -d --build
  only:
    - develop

deploy:production:
  stage: deploy
  environment: production
  script:
    - docker-compose -f docker-compose.prod.yml up -d --build
  only:
    - main
  when: manual  # Ручное подтверждение деплоя в продакшн
```

### 8. Резервное копирование

- **PostgreSQL:** ежедневный pg_dump, хранение 30 дней, ротация
- **S3 (документы):** версионирование бакета, cross-region replication
- **Конфигурации:** в Git
- **Проверка восстановления:** ежемесячный тест restore из бэкапа

### 9. Disaster Recovery

- Реплика в другом ЦОД (требование из раздела 9 ТЗ)
- RTO (Recovery Time Objective): < 4 часов
- RPO (Recovery Point Objective): < 1 час
- Документированная процедура переключения

### 10. Сканирование уязвимостей

- **npm audit** — при каждом CI-прогоне
- **Trivy** — сканирование Docker-образов
- **OWASP ZAP** — базовое сканирование (ежеквартально, по требованию ЦБ)
- **Snyk** — мониторинг зависимостей (опционально)
- Автоматическое создание issue при обнаружении critical/high

### 11. Docker-образы для продакшн

**Frontend Dockerfile:**
```dockerfile
# Multi-stage build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER node
EXPOSE 3000
CMD ["npm", "start"]
```

**CMS Dockerfile:** аналогично, multi-stage, production build.

---

## Критерии приёмки

- [ ] Все security headers присутствуют (проверить через securityheaders.com → A+ рейтинг)
- [ ] CSP не блокирует легитимные ресурсы (карты, метрика, hcaptcha, шрифты)
- [ ] Rate limiting работает: 11-й запрос к API за секунду → 429
- [ ] SSL: A+ на ssllabs.com
- [ ] HSTS включён с preload
- [ ] Sentry ловит ошибки frontend и backend
- [ ] ELK: логи доступны в Kibana, хранятся > 30 дней
- [ ] Grafana: дашборд с метриками, алерты настроены
- [ ] CI/CD: пайплайн проходит lint → test → build → e2e → security → deploy
- [ ] Деплой на staging автоматический, на production — ручной
- [ ] Бэкап PostgreSQL: ежедневный, проверка restore
- [ ] Docker-образы: multi-stage, минимальный размер, non-root user
- [ ] npm audit: 0 critical/high уязвимостей
- [ ] Trivy: 0 critical уязвимостей в Docker-образах

---

## Тестирование

### Security-тесты
- Проверка наличия всех HTTP security headers
- CSP: блокировка inline-скрипта с неизвестным источником
- Rate limiting: N+1 запрос → 429
- SQL injection на формах: `'; DROP TABLE` → ошибка валидации, не SQL-ошибка
- XSS: `<script>alert(1)</script>` в полях формы → экранируется

### Infrastructure-тесты
- Docker health checks: все сервисы healthy
- PostgreSQL: подключение, создание записи, чтение
- Redis: SET/GET работает
- Nginx: proxy_pass корректный

### E2E-тесты
```
e2e/security.spec.ts:

1. HTTPS: сайт доступен только по HTTPS, HTTP → redirect 301
2. Security headers: проверить Strict-Transport-Security, X-Frame-Options, CSP
3. /api/ endpoints: без авторизации CMS → 403 (для protected)
4. Form XSS: ввести <script> в поле формы → текст экранирован в ответе
5. Rate limit: отправить 5 форм подряд → 429 на 4-й

e2e/performance.spec.ts:

6. Lighthouse Performance: score ≥ 90 (mobile)
7. Lighthouse Accessibility: score ≥ 90
8. Lighthouse SEO: score ≥ 95
9. Lighthouse Best Practices: score ≥ 90
10. LCP < 2.5s на главной странице
11. CLS < 0.1 на всех страницах
12. FID (или INP) < 200ms

e2e/cross-browser.spec.ts:
13. Главная загружается в Chromium (desktop + mobile viewport)
14. Главная загружается в Firefox
15. Главная загружается в WebKit (Safari)
16. Навигация работает во всех 3 движках
17. Форма отправляется во всех 3 движках
```
