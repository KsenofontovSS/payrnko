# TASK-06: Главная страница

## Метаданные
- **ID:** TASK-06
- **Приоритет:** Критический
- **Роли:** Frontend-разработчик, Верстальщик, Дизайнер
- **Зависимости:** TASK-03 (Layout), TASK-05 (API-клиент)
- **Оценка:** 5–7 дней

---

## Цель

Реализовать главную страницу сайта — лендинг с пятью ключевыми секциями: Hero-блок, карточки услуг, блок доверия, анонсы новостей и CTA-блок. Все данные получаются из CMS. Полная адаптивность, анимации при скролле, pixel-perfect по макету.

---

## Что нужно сделать

### 1. Hero-секция (`src/components/sections/HeroSection.tsx`)

**Визуал (раздел 6.1 дизайн-спецификации):**
- Полноэкранный блок (100vh минус высота header)
- Фон: градиент `linear-gradient(135deg, #0F2B4E 0%, #1A365D 40%, #2B6CB0 100%)`
- На заднем плане: тонкий геометрический паттерн из линий и точек (SVG или Canvas), символизирующий платёжные потоки. Паттерн медленно «плавает» (subtle float, 20s, infinite, linear)
- Контент по центру вертикально

**Контент:**
- **H1**: «Простые платёжные решения для вашего бизнеса» — 48–56px, weight 700, white
- **Подзаголовок**: «Расчётная небанковская кредитная организация с лицензией Банка России» — 18px, weight 400, white/80%
- **Две кнопки:**
  - «Узнать об услугах» → `/services` (CTA вариант: белая на тёмном фоне)
  - «Связаться с нами» → `/contacts` (Secondary: прозрачная с белой рамкой)

**Анимации (раздел 8.1):**
- H1: fade-in + slide-up, duration 0.8s, delay 0.2s
- Подзаголовок: fade-in + slide-up, duration 0.8s, delay 0.4s
- Кнопки: fade-in + scale, duration 0.6s, delay 0.6s
- Геометрический паттерн: subtle float, 20s, infinite

### 2. Секция услуг (`src/components/sections/ServicesSection.tsx`)

**Данные:** `getServices(locale)` из CMS (TASK-05)

**Layout:**
- Заголовок H2: «Наши услуги»
- Сетка: 3 колонки (desktop), 2 (tablet), 1 (mobile)
- 6 карточек (или сколько вернёт CMS)

**Карточка услуги:**
- Иконка: Lucide Icons, 32px, цвет `#2B6CB0`
- Заголовок услуги (H3)
- Краткое описание (2–3 строки, body small)
- Ссылка «Подробнее →» (Ghost button)

**Hover-эффект:** тень увеличивается, иконка `scale(1.05)`, transition 300ms

**Анимация:** staggered fade-in при попадании в viewport (Intersection Observer / Framer Motion `whileInView`). Duration 0.5s, stagger 0.1s.

### 3. Блок доверия (`src/components/sections/TrustSection.tsx`)

**Визуал:**
- Горизонтальная полоса, фон `#EBF8FF`
- 3 показателя в ряд (grid 3 колонки)

| Иконка | Число | Подпись |
|--------|-------|---------|
| Shield (щит) | «Лицензия ЦБ РФ № 3566» | «Банк России» |
| TrendingUp (график) | «120 млн руб.» | «Уставный капитал» |
| Lock (замок) | «TLS 1.3» | «Шифрование данных» |

**Стиль:**
- Числа: 36px, bold, `#1A365D`
- Подписи: 16px, `#4A5568`
- Иконки: 48px, `#2B6CB0`

**Анимация:** числа анимированно «считают» от 0 до целевого значения (count-up), duration 2s, easing easeOut. Запускается при попадании в viewport.

### 4. Секция новостей (`src/components/sections/NewsPreviewSection.tsx`)

**Данные:** `getLatestNews(locale, 3)` из CMS

**Layout:**
- Заголовок H2: «Новости»
- 3 карточки новостей в ряд (desktop), 1 (mobile)
- Кнопка «Все новости →» справа от заголовка или под карточками

**Карточка новости:**
- Дата (formatted, body small, `#4A5568`)
- Рубрика (Badge компонент)
- Заголовок (H3, ссылка)
- Первые 2 строки текста (excerpt)
- «Читать далее» (Ghost button)

**Анимация:** fade-in при скролле, threshold 0.3, duration 0.6s

### 5. CTA-секция (`src/components/sections/CTASection.tsx`)

**Визуал:**
- Полноширинная секция
- Фон: акцентный градиент `linear-gradient(90deg, #2B6CB0 0%, #4299E1 100%)`
- Текст: «Готовы обсудить сотрудничество?» — H2, белый
- Кнопка: «Связаться с нами» → `/contacts` (CTA вариант)

### 6. Сборка страницы (`app/[locale]/page.tsx`)

Server Component. Получает данные параллельно:
```typescript
const [services, latestNews, companyInfo] = await Promise.all([
  getServices(locale),
  getLatestNews(locale, 3),
  getCompanyInfo(),
]);
```

Порядок секций:
1. `<HeroSection />`
2. `<ServicesSection services={services} />`
3. `<TrustSection companyInfo={companyInfo} />`
4. `<NewsPreviewSection news={latestNews} />`
5. `<CTASection />`

---

## Дизайнеру

- Макет Hero-блока: desktop (1280px), tablet (768px), mobile (375px)
- Геометрический паттерн: подготовить SVG/иллюстрацию в Figma
- Карточки услуг: все состояния (default, hover, focus)
- Блок доверия: вертикальный layout на мобильном
- CTA-секция: минималистичный дизайн, только текст + кнопка
- Анимации: описать в Figma через Smart Animate прототип

---

## Верстальщику

- Hero: `min-h-screen`, flexbox center, gradient через Tailwind `bg-gradient-to-br`
- Геом. паттерн: `absolute inset-0`, `opacity-10`, SVG background или Canvas
- Сетка услуг: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Блок доверия: `grid grid-cols-1 md:grid-cols-3`, текст по центру каждой ячейки
- Count-up анимация: использовать `useCountUp` хук или Framer Motion `useMotionValue`
- CTA: `py-20`, текст и кнопка по центру
- Все секции с `<Section>` и `<Container>` обёртками

---

## Критерии приёмки

- [ ] Hero-блок: градиент, заголовок, подзаголовок, 2 кнопки отображаются корректно
- [ ] Геометрический паттерн плавно анимирован на фоне hero
- [ ] Карточки услуг отображают данные из CMS
- [ ] Hover на карточках: тень и scale иконки работают
- [ ] Блок доверия: 3 показателя, count-up анимация при скролле
- [ ] 3 последние новости отображаются с датой, рубрикой, заголовком
- [ ] CTA-кнопки ведут на правильные URL
- [ ] Адаптивность: 320px, 768px, 1024px, 1280px — без горизонтального скролла
- [ ] `prefers-reduced-motion` отключает все анимации
- [ ] LCP < 2.5s (hero-заголовок должен быть LCP-элементом)
- [ ] Ни одного CLS (Cumulative Layout Shift) при загрузке

---

## Тестирование

### Unit-тесты
- HeroSection: рендер заголовка, подзаголовка, 2 кнопки
- ServicesSection: рендер N карточек по данным, ссылки корректны
- TrustSection: рендер 3 показателей
- NewsPreviewSection: рендер карточек новостей с форматированной датой
- CTASection: рендер текста и кнопки

### Integration-тесты
- Главная страница: Server Component получает данные из mock API, все секции рендерятся

### E2E-тесты
```
e2e/home.spec.ts:

1. Загрузка главной:
   - HTTP 200
   - H1 содержит "Простые платёжные решения"
   - 2 CTA-кнопки видимы

2. Секция услуг:
   - Минимум 3 карточки услуг отображаются
   - Клик «Подробнее» → переход на /services/:slug

3. Блок доверия:
   - Текст "Лицензия ЦБ РФ" присутствует
   - Число "120" присутствует (уставный капитал)

4. Секция новостей:
   - 3 карточки новостей видимы
   - Клик на заголовок → переход на /news/:slug
   - Кнопка "Все новости" → переход на /news

5. CTA:
   - Кнопка "Связаться с нами" → /contacts

6. Адаптивность (viewport 375px):
   - Все секции в 1 колонку
   - Нет горизонтального скролла
   - Кнопки полноширинные

7. Performance:
   - Lighthouse Performance > 90
   - LCP < 2.5s
   - CLS < 0.1

8. Accessibility:
   - axe-core: 0 critical/serious
   - H1 единственный на странице
   - Все изображения с alt
```
