# Отчёт по аудиту безопасности

**Репозиторий:** KsenofontovSS/payrnko (ветка `claude/develop-from-markdown-WsgZk`)
**Дата:** 2026-03-30
**Аудитор:** Claude Code
**Стек:** Next.js 14 / React 18 / TypeScript / Strapi 4 / PostgreSQL 16 / Redis 7 / Nginx / Docker

---

## Общая оценка

Проект демонстрирует хорошие базовые практики безопасности: секреты вынесены в переменные окружения, `.gitignore` корректно настроен, используются типизация и Zod-валидация. Однако обнаружены **критические проблемы** в конфигурации CMS (захардкоженные placeholder-ключи шифрования, отключённый SSL для БД), слабая CSP-политика с `'unsafe-inline'` и `'unsafe-eval'`, отсутствие HTTPS в nginx, а также ненадёжная самописная sanitize-функция. Контактная форма не защищена CAPTCHA. Docker-контейнеры запускаются от root.

Для финансовой организации (РНКО), подчиняющейся Положению ЦБ РФ № 851-П и ГОСТ Р 57580.1-2017, эти проблемы **должны быть устранены до production-деплоя**.

---

## Статистика

| Severity | Количество |
|----------|-----------|
| CRITICAL | 6         |
| HIGH     | 5         |
| MEDIUM   | 6         |
| LOW      | 5         |
| INFO     | 2         |
| **ИТОГО**| **24**    |

---

## Найденные уязвимости

### [CRITICAL] C-1. Захардкоженные placeholder-ключи шифрования Strapi

- **Файл:** `cms/config/server.ts:5`
- **CWE:** CWE-798 (Use of Hard-coded Credentials)
- **Описание:** `APP_KEYS` — ключи, используемые Strapi для подписи JWT-токенов и сессий. Значение по умолчанию `['key1', 'key2']` тривиально предсказуемо. Если `.env` не настроен, сервер запустится с этими ключами — атакующий сможет подделывать токены сессий администратора CMS.
- **Код:**
  ```typescript
  app: {
    keys: env.array('APP_KEYS', ['key1', 'key2']),
  },
  ```
- **Пример эксплуатации:** Зная ключи `key1,key2`, атакующий генерирует валидный JWT-токен администратора Strapi и получает полный доступ к CMS.
- **Рекомендация:** Убрать default-значение, приложение должно падать при отсутствии ключей:
  ```typescript
  app: {
    keys: env.array('APP_KEYS'),
  },
  ```
  Добавить валидацию при старте: если `APP_KEYS` пуст — `throw new Error('APP_KEYS must be set')`.

---

### [CRITICAL] C-2. SSL для PostgreSQL отключён по умолчанию

- **Файл:** `cms/config/database.ts:10`
- **CWE:** CWE-319 (Cleartext Transmission of Sensitive Information)
- **Описание:** `ssl: false` по умолчанию означает, что весь трафик между CMS и БД (включая credentials, PII клиентов, финансовые данные) передаётся в открытом виде. Для организации, подчиняющейся Положению ЦБ РФ № 851-П, это нарушение требований.
- **Код:**
  ```typescript
  ssl: env.bool('DATABASE_SSL', false),
  ```
- **Рекомендация:** Изменить default на `true`:
  ```typescript
  ssl: env.bool('DATABASE_SSL', true),
  ```

---

### [CRITICAL] C-3. Пустой пароль БД по умолчанию

- **Файл:** `cms/config/database.ts:9`
- **CWE:** CWE-521 (Weak Password Requirements)
- **Описание:** Если переменная `DATABASE_PASSWORD` не задана, Strapi подключается к PostgreSQL с пустым паролем.
- **Код:**
  ```typescript
  password: env('DATABASE_PASSWORD', ''),
  ```
- **Рекомендация:** Убрать default, требовать явную настройку:
  ```typescript
  password: env('DATABASE_PASSWORD'),
  ```

---

### [CRITICAL] C-4. CSP разрешает `'unsafe-inline'` и `'unsafe-eval'` для скриптов

- **Файл:** `nginx/security-headers.conf:8`
- **CWE:** CWE-79 (Improper Neutralization of Input During Web Page Generation)
- **Описание:** Директивы `'unsafe-inline'` и `'unsafe-eval'` в `script-src` полностью нивелируют защиту CSP от XSS. Любой инъектированный inline-скрипт будет выполнен браузером.
- **Код:**
  ```nginx
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://hcaptcha.com https://*.hcaptcha.com;
  ```
- **Рекомендация:** Убрать `'unsafe-inline'` и `'unsafe-eval'`. Для Next.js использовать nonce-based CSP:
  ```nginx
  script-src 'self' https://hcaptcha.com https://*.hcaptcha.com;
  ```
  Если inline-скрипты необходимы (JSON-LD) — использовать `'nonce-...'` или `'sha256-...'` хеши. Также добавить `form-action 'self'; upgrade-insecure-requests;`.

---

### [CRITICAL] C-5. Отсутствие HTTPS в Nginx

- **Файл:** `nginx/nginx.conf:34`
- **CWE:** CWE-319 (Cleartext Transmission of Sensitive Information)
- **Описание:** Nginx слушает только порт 80 (HTTP). SSL/TLS не настроен. Несмотря на то что в `docker-compose.prod.yml` пробрасываются порты 80 и 443 и монтируется volume `./ssl`, в самом nginx.conf нет `listen 443 ssl`, нет конфигурации сертификатов, нет редиректа HTTP→HTTPS.
- **Код:**
  ```nginx
  server {
      listen 80;
      server_name _;
  ```
- **Рекомендация:** Добавить HTTPS-конфигурацию:
  ```nginx
  server {
      listen 80;
      server_name ppr-rnko.ru;
      return 301 https://$host$request_uri;
  }

  server {
      listen 443 ssl http2;
      server_name ppr-rnko.ru;

      ssl_certificate /etc/nginx/ssl/cert.pem;
      ssl_certificate_key /etc/nginx/ssl/key.pem;
      ssl_protocols TLSv1.2 TLSv1.3;
      ssl_ciphers HIGH:!aNULL:!MD5;
      ssl_prefer_server_ciphers on;
      # ... остальная конфигурация
  }
  ```

---

### [CRITICAL] C-6. Контактная форма не защищена CAPTCHA

- **Файл:** `frontend/src/components/forms/ContactForm.tsx:36-37`
- **CWE:** CWE-799 (Improper Control of Interaction Frequency)
- **Описание:** Вместо реальной отправки формы с hCaptcha-токеном используется `setTimeout` заглушка. Форма может быть атакована ботами без ограничений.
- **Код:**
  ```typescript
  // В продакшне здесь будет вызов submitContactForm с hCaptcha токеном
  await new Promise((resolve) => setTimeout(resolve, 1500));
  ```
- **Также:** В Zod-схеме `frontend/src/lib/validations/contactForm.ts` отсутствует поле `captchaToken`, хотя API-тип `ContactFormData` в `frontend/src/types/api.ts:135` его требует.
- **Рекомендация:** Интегрировать `@hcaptcha/react-hcaptcha`, добавить `captchaToken` в Zod-схему, использовать `submitContactForm()` из API-клиента.

---

### [HIGH] H-1. Strapi Admin Panel публично доступна без защиты

- **Файл:** `nginx/nginx.conf:61-68`
- **CWE:** CWE-306 (Missing Authentication for Critical Function)
- **Описание:** Админ-панель Strapi (`/admin`) проксируется без дополнительной аутентификации, IP-ограничений или rate limiting. Атакующий может проводить брутфорс на скорости 30 req/s (лимит `static` зоны).
- **Код:**
  ```nginx
  location /admin {
      proxy_pass http://cms:1337/admin;
      # Нет rate limiting, нет basic auth, нет IP whitelist
  }
  ```
- **Рекомендация:**
  ```nginx
  limit_req_zone $binary_remote_addr zone=admin:10m rate=2r/s;

  location /admin {
      limit_req zone=admin burst=5 nodelay;
      # allow 10.0.0.0/8;  # IP вашей сети
      # deny all;
      proxy_pass http://cms:1337/admin;
      # ... headers
  }
  ```

---

### [HIGH] H-2. Самописная функция sanitizeHtml ненадёжна

- **Файл:** `frontend/src/lib/utils/sanitizeHtml.ts:1-10`
- **CWE:** CWE-79 (Improper Neutralization of Input During Web Page Generation)
- **Описание:** Регулярные выражения для санитизации HTML легко обходятся. Regex для event handlers ловит только двойные кавычки, пропуская одинарные (`onclick='alert(1)'`), HTML-entity кодированные атрибуты, SVG-теги (`<svg onload=...>`), `<iframe>`, `<embed>`, `<object>`, style-атрибуты с expression, src-атрибуты с `javascript:`.
- **Код:**
  ```typescript
  const EVENT_HANDLERS = /\s+on\w+\s*=\s*"[^"]*"/gi;  // Только двойные кавычки!
  const JAVASCRIPT_URLS = /href\s*=\s*"javascript:[^"]*"/gi;  // Только href, не src
  ```
- **Пример обхода:** `<img src=x onerror='alert(1)'>` — одинарные кавычки не пойманы.
- **Рекомендация:** Заменить на DOMPurify:
  ```bash
  npm install dompurify @types/dompurify
  ```
  ```typescript
  import DOMPurify from 'dompurify';
  export function sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html);
  }
  ```

---

### [HIGH] H-3. Docker-контейнеры запускаются от root

- **Файлы:** `docker/frontend/Dockerfile:21-28`, `docker/cms/Dockerfile:21-29`
- **CWE:** CWE-250 (Execution with Unnecessary Privileges)
- **Описание:** Ни один Dockerfile не содержит директивы `USER`. Контейнеры запускаются от root. При container escape атакующий получает root-доступ на хосте.
- **Рекомендация:** Добавить в production stage обоих Dockerfile:
  ```dockerfile
  RUN addgroup -g 1001 -S nodejs && \
      adduser -S nodejs -u 1001
  USER nodejs
  ```

---

### [HIGH] H-4. Отсутствует `server_tokens off` в Nginx

- **Файл:** `nginx/nginx.conf`
- **CWE:** CWE-200 (Exposure of Sensitive Information)
- **Описание:** Без `server_tokens off;` Nginx отдаёт свою версию в заголовке `Server` и на страницах ошибок, облегчая атакующему подбор эксплойтов.
- **Рекомендация:** Добавить в блок `http`:
  ```nginx
  server_tokens off;
  ```

---

### [HIGH] H-5. CMS-контент рендерится без санитизации

- **Файлы:** `frontend/src/app/news/[slug]/page.tsx:57-62`, `frontend/src/app/services/[slug]/page.tsx`
- **CWE:** CWE-79 (XSS)
- **Описание:** Контент из CMS (Rich Text) разбивается по `\n\n` и рендерится в JSX без вызова `sanitizeHtml()`. Если CMS скомпрометирована или редактор вставит вредоносный HTML, он может быть отрисован. React экранирует строки по умолчанию, но если в будущем контент будет рендериться через `dangerouslySetInnerHTML` — это станет вектором XSS.
- **Рекомендация:** Применять `sanitizeHtml()` (после замены на DOMPurify, см. H-2) ко всему CMS-контенту перед рендерингом.

---

### [MEDIUM] M-1. Слабый дефолтный пароль PostgreSQL в dev-окружении

- **Файл:** `docker/docker-compose.yml:13`
- **CWE:** CWE-521 (Weak Password Requirements)
- **Описание:** Fallback-пароль `strapi_dev` предсказуем и может быть использован при атаке на БД, которая экспонирует порт 5432 на хост (строка 9).
- **Код:**
  ```yaml
  POSTGRES_PASSWORD: ${DATABASE_PASSWORD:-strapi_dev}
  ```
- **Рекомендация:** Привязать порты к localhost: `'127.0.0.1:5432:5432'`. Использовать сильный случайный пароль даже для dev.

---

### [MEDIUM] M-2. Dev-compose экспонирует БД и Redis наружу

- **Файл:** `docker/docker-compose.yml:8-9, 26-27`
- **CWE:** CWE-284 (Improper Access Control)
- **Описание:** PostgreSQL (5432) и Redis (6379) доступны с любого сетевого интерфейса хоста. Redis без аутентификации.
- **Рекомендация:** Привязать к localhost:
  ```yaml
  ports:
    - '127.0.0.1:5432:5432'
  ```

---

### [MEDIUM] M-3. Cookie consent хранится в localStorage вместо HTTP cookie

- **Файл:** `frontend/src/components/forms/CookieBanner.tsx:14,21,26`
- **CWE:** CWE-922 (Insecure Storage of Sensitive Information)
- **Описание:** `localStorage` доступен любому JavaScript на странице. При XSS атакующий может читать/модифицировать согласие. Спецификация проекта (TASK-17) требует HTTP cookie с флагами `Secure`, `SameSite=Lax`.
- **Рекомендация:** Использовать `document.cookie` с соответствующими флагами:
  ```typescript
  document.cookie = `cookie_consent=accepted; path=/; max-age=31536000; SameSite=Lax; Secure`;
  ```

---

### [MEDIUM] M-4. Отсутствие `client_max_body_size` в Nginx

- **Файл:** `nginx/nginx.conf`
- **CWE:** CWE-400 (Uncontrolled Resource Consumption)
- **Описание:** Без явного ограничения размера запроса nginx использует дефолт 1MB, но лучше установить явно для защиты от DoS через загрузку больших файлов.
- **Рекомендация:**
  ```nginx
  client_max_body_size 10M;
  ```

---

### [MEDIUM] M-5. Permissions-Policy ограничивает не все API

- **Файл:** `nginx/security-headers.conf:6`
- **Описание:** Заблокированы только camera, microphone, geolocation. Не заблокированы: `payment`, `usb`, `midi`, `xr-spatial-tracking` и др.
- **Рекомендация:**
  ```nginx
  add_header Permissions-Policy "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()" always;
  ```

---

### [MEDIUM] M-6. HSTS max-age рекомендуется увеличить до 2 лет

- **Файл:** `nginx/security-headers.conf:7`
- **Описание:** Текущее значение `max-age=31536000` (1 год). Для включения в HSTS preload list рекомендуется `max-age=63072000` (2 года).
- **Рекомендация:**
  ```nginx
  add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
  ```

---

### [LOW] L-1. Отсутствие proxy timeout в Nginx

- **Файл:** `nginx/nginx.conf`
- **CWE:** CWE-400 (Uncontrolled Resource Consumption)
- **Описание:** Нет явных `proxy_connect_timeout`, `proxy_read_timeout`, `proxy_send_timeout`. Дефолт 60s может оставлять соединения открытыми.
- **Рекомендация:**
  ```nginx
  proxy_connect_timeout 10s;
  proxy_send_timeout 30s;
  proxy_read_timeout 30s;
  ```

---

### [LOW] L-2. Нет кастомных error pages в Nginx

- **Файл:** `nginx/nginx.conf`
- **Описание:** Стандартные страницы ошибок Nginx раскрывают версию сервера.
- **Рекомендация:** Добавить `error_page 404 /404; error_page 500 502 503 504 /error;` и проксировать на Next.js.

---

### [LOW] L-3. Dev-ветка в GitHub Actions deploy workflow

- **Файл:** `.github/workflows/deploy-pages.yml:5`
- **Описание:** Временная ветка `claude/develop-from-markdown-WsgZk` в триггере деплоя — может привести к случайному деплою непроверенного кода.
- **Рекомендация:** Оставить только `main`:
  ```yaml
  branches: ['main']
  ```

---

### [LOW] L-4. localStorage.getItem без валидации в AccessibilityPanel

- **Файл:** `frontend/src/components/accessibility/AccessibilityPanel.tsx:24-31`
- **CWE:** CWE-20 (Improper Input Validation)
- **Описание:** `JSON.parse(saved)` обёрнут в try/catch (хорошо), но распарсенные данные присваиваются в state без проверки структуры. Вредоносное значение в localStorage может вызвать непредсказуемое поведение.
- **Рекомендация:** Валидировать через Zod-схему перед `setSettings()`.

---

### [LOW] L-5. Отсутствие rate limiting зоны для форм

- **Файл:** `nginx/nginx.conf:30-31`
- **Описание:** В спецификации проекта (TASK-18) описана зона `forms` с rate=3r/m, но в реальном nginx.conf определены только зоны `api` и `static`. Форма обратной связи не имеет отдельного лимита.
- **Рекомендация:** Добавить:
  ```nginx
  limit_req_zone $binary_remote_addr zone=forms:10m rate=3r/m;
  ```
  И в location для `/api/contact-form`:
  ```nginx
  location = /api/contact-form {
      limit_req zone=forms burst=2 nodelay;
      proxy_pass http://cms:1337/api/contact-form;
  }
  ```

---

### [INFO] I-1. Нет CMS lock-файла

- **Файл:** `cms/package.json`
- **Описание:** Отсутствует `package-lock.json` для CMS. Зависимости не зафиксированы, `npm install` может установить разные версии в разных окружениях.
- **Рекомендация:** Выполнить `cd cms && npm install` и закоммитить `package-lock.json`.

---

### [INFO] I-2. Mock-данные вместо реальной CMS-интеграции

- **Файлы:** `frontend/src/app/page.tsx`, `frontend/src/app/news/page.tsx`, `frontend/src/app/services/page.tsx`, и др.
- **Описание:** Многие страницы используют захардкоженные mock-данные вместо вызовов API. Это не уязвимость, но означает, что реальные потоки данных (и их санитизация) не протестированы.

---

## Рекомендации по приоритетам

### 1. Немедленно (до деплоя)

| # | Действие | Файл |
|---|----------|------|
| 1 | Убрать дефолтные `APP_KEYS`, требовать через `.env` | `cms/config/server.ts` |
| 2 | Включить SSL для БД по умолчанию | `cms/config/database.ts` |
| 3 | Убрать пустой пароль по умолчанию | `cms/config/database.ts` |
| 4 | Настроить HTTPS в nginx + редирект HTTP→HTTPS | `nginx/nginx.conf` |
| 5 | Убрать `'unsafe-inline'` и `'unsafe-eval'` из CSP | `nginx/security-headers.conf` |
| 6 | Интегрировать hCaptcha в контактную форму | `frontend/src/components/forms/ContactForm.tsx` |

### 2. Краткосрочно (в ближайшем спринте)

| # | Действие | Файл |
|---|----------|------|
| 7 | Заменить `sanitizeHtml` на DOMPurify | `frontend/src/lib/utils/sanitizeHtml.ts` |
| 8 | Добавить `USER nodejs` в Dockerfiles | `docker/frontend/Dockerfile`, `docker/cms/Dockerfile` |
| 9 | Защитить `/admin` (rate limit + IP whitelist) | `nginx/nginx.conf` |
| 10 | Добавить `server_tokens off` | `nginx/nginx.conf` |
| 11 | Перевести cookie consent на HTTP cookie | `frontend/src/components/forms/CookieBanner.tsx` |
| 12 | Добавить rate limit зону `forms` | `nginx/nginx.conf` |

### 3. Долгосрочно (системные улучшения)

| # | Действие |
|---|----------|
| 13 | Внедрить Docker Secrets / Vault для управления секретами в production |
| 14 | Добавить runtime-валидацию CMS-ответов через Zod |
| 15 | Настроить Redis authentication (requirepass) |
| 16 | Создать `security.txt` (RFC 9116) |
| 17 | Интегрировать OWASP ZAP в CI/CD для автоматического сканирования |
| 18 | Добавить `package-lock.json` для CMS |

---

## Положительные практики

- **Секреты:** Все реальные секреты вынесены в `.env`, `.gitignore` корректно настроен, в коде нет захардкоженных ключей/паролей/токенов
- **TypeScript strict:** `strict: true` включён, `any` в коде не используется
- **Валидация форм:** React Hook Form + Zod — надёжный подход к валидации
- **Security headers:** Базовый набор заголовков (X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy) присутствует
- **Docker:** Multi-stage builds, Alpine-образы, health checks, resource limits в production compose
- **Rate limiting:** Настроены зоны для API и статики
- **Ошибки:** Error page не раскрывает stack trace и внутренние пути
- **Accessibility:** Реализована панель доступности (ФЗ-181)
- **CI/CD:** Security stage в `.gitlab-ci.yml` (npm audit, Trivy)
- **Production compose:** Порты БД и Redis не экспонируются наружу
