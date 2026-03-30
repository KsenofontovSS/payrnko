# TASK-16: SEO, микроразметка и meta-теги

## Метаданные
- **ID:** TASK-16
- **Приоритет:** Высокий
- **Роли:** Frontend-разработчик
- **Зависимости:** TASK-06–TASK-13 (все страницы)
- **Оценка:** 2–3 дня

---

## Цель

Обеспечить полную SEO-оптимизацию сайта: уникальные meta-теги на каждой странице, микроразметка Schema.org, Open Graph / Twitter Cards, автоматически генерируемые sitemap.xml и robots.txt, канонические URL.

---

## Что нужно сделать

### 1. Meta-теги для каждой страницы

Реализовать через Next.js `generateMetadata` (App Router).

| Страница | `<title>` | `<meta description>` |
|----------|-----------|---------------------|
| Главная | РНКО «Простые платежные решения» — Платёжные решения для бизнеса | Расчётная небанковская кредитная организация. Лицензия ЦБ РФ № 3566. Расчётные услуги, переводы, кассовое обслуживание. |
| О компании | О компании — РНКО «Простые платежные решения» | История, миссия и лицензия РНКО ППР. Рег. номер ЦБ РФ 3566. |
| Услуги | Услуги — РНКО «Простые платежные решения» | Банковские счета, расчёты, переводы, инкассация, кассовое обслуживание, валютные операции. |
| Тарифы | Тарифы на услуги — РНКО «Простые платежные решения» | Актуальные тарифы на расчётные и платёжные услуги РНКО ППР. |
| Раскрытие | Раскрытие информации — РНКО «Простые платежные решения» | Финансовая отчётность, нормативы, аудит в соответствии с ФЗ-395-1. |
| Новости | Новости — РНКО «Простые платежные решения» | Новости компании, регуляторные изменения, обновления тарифов. |
| Контакты | Контакты — РНКО «Простые платежные решения» | Адрес, телефон, email. Санкт-Петербург, Пулковское шоссе 40. |
| Новость (dynamic) | {title} — Новости РНКО ППР | {excerpt} |
| Услуга (dynamic) | {title} — Услуги РНКО ППР | {short_description} |

### 2. Open Graph и Twitter Cards

На каждой странице:
```html
<meta property="og:type" content="website" />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="https://ppr-rnko.ru/og-image.jpg" />
<meta property="og:url" content="https://ppr-rnko.ru/about" />
<meta property="og:locale" content="ru_RU" />
<meta property="og:locale:alternate" content="en_US" />
<meta property="og:site_name" content="РНКО «Простые платежные решения»" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
```

Для новостей: `og:type` = `article`, `og:image` = cover image из CMS.

### 3. Микроразметка Schema.org

#### Organization (на главной и всех страницах — в layout)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "РНКО «Простые платежные решения»",
  "legalName": "Расчетная небанковская кредитная организация «Простые платежные решения» (ООО)",
  "url": "https://ppr-rnko.ru",
  "logo": "https://ppr-rnko.ru/logo.svg",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+7-...",
    "email": "info@ppr-rnko.ru",
    "contactType": "customer service",
    "areaServed": "RU",
    "availableLanguage": ["Russian", "English"]
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "ш. Пулковское, д. 40, к. 4, литера Д, офис С53",
    "addressLocality": "Санкт-Петербург",
    "postalCode": "196246",
    "addressCountry": "RU"
  }
}
```

#### BreadcrumbList (на всех внутренних страницах)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://ppr-rnko.ru/" },
    { "@type": "ListItem", "position": 2, "name": "О компании", "item": "https://ppr-rnko.ru/about" }
  ]
}
```

#### NewsArticle (на детальных страницах новостей)
```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "...",
  "datePublished": "2025-03-15",
  "author": { "@type": "Organization", "name": "РНКО ППР" },
  "publisher": { "@type": "Organization", "name": "РНКО ППР" }
}
```

### 4. sitemap.xml

**Файл:** `app/sitemap.ts` (Next.js автоматическая генерация)

Включить:
- Все статические страницы (/, /about, /services, /tariffs, /disclosure, /contacts, /compliance, /news, /privacy, /sitemap)
- Все динамические страницы (/services/:slug, /news/:slug, /disclosure/*)
- Обе локали (/ru/..., /en/...)
- Priority: главная = 1.0, о компании/услуги = 0.8, новости = 0.6
- changefreq: главная = daily, новости = daily, остальные = weekly

### 5. robots.txt

**Файл:** `app/robots.ts`

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Sitemap: https://ppr-rnko.ru/sitemap.xml
```

### 6. Канонические URL

На каждой странице:
```html
<link rel="canonical" href="https://ppr-rnko.ru/ru/about" />
```

### 7. hreflang

```html
<link rel="alternate" hreflang="ru" href="https://ppr-rnko.ru/ru/about" />
<link rel="alternate" hreflang="en" href="https://ppr-rnko.ru/en/about" />
<link rel="alternate" hreflang="x-default" href="https://ppr-rnko.ru/ru/about" />
```

### 8. Семантическая вёрстка

Проверить на всех страницах:
- Один `<h1>` на страницу
- Иерархия заголовков без пропусков (h1 → h2 → h3)
- `<article>` для новостей
- `<nav>` для навигации
- `<main>` для основного контента
- `<footer>` для подвала
- `<time datetime="...">` для дат

---

## Критерии приёмки

- [ ] Каждая страница имеет уникальный `<title>` и `<meta description>`
- [ ] Open Graph теги на каждой странице (проверить через Facebook Debug Tool)
- [ ] Schema.org Organization разметка в layout
- [ ] BreadcrumbList на внутренних страницах
- [ ] NewsArticle на детальных новостях
- [ ] `sitemap.xml` генерируется, содержит все страницы и обе локали
- [ ] `robots.txt` блокирует /api/ и /admin/
- [ ] Канонические URL на всех страницах
- [ ] hreflang теги для ru/en
- [ ] Один `<h1>` на страницу, иерархия заголовков корректна
- [ ] Lighthouse SEO score > 95

---

## Тестирование

### Unit-тесты
- `generateMetadata` для каждой страницы: title и description корректны
- Schema.org JSON-LD: валидный JSON, содержит обязательные поля
- Sitemap: содержит все статические страницы + обе локали

### E2E-тесты
```
e2e/seo.spec.ts:

1. Главная: <title> содержит "РНКО", <meta description> не пустой
2. /about: <title> содержит "О компании"
3. Open Graph: og:title, og:description, og:image присутствуют
4. Schema.org: JSON-LD script с @type Organization в <head>
5. Breadcrumbs: JSON-LD BreadcrumbList на /about
6. /sitemap.xml → 200, Content-Type: application/xml, содержит <url>
7. /robots.txt → 200, содержит "Sitemap:", "Disallow: /api/"
8. Canonical URL: <link rel="canonical"> на каждой странице
9. hreflang: <link rel="alternate" hreflang="ru"> и hreflang="en"
10. Заголовки: на каждой странице ровно 1 <h1>
11. Lighthouse SEO audit: score ≥ 95
```
