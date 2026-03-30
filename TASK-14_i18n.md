# TASK-14: Мультиязычность (i18n)

## Метаданные
- **ID:** TASK-14
- **Приоритет:** Высокий
- **Роли:** Frontend-разработчик
- **Зависимости:** TASK-03 (Layout)
- **Оценка:** 3–4 дня

---

## Цель

Реализовать двуязычный сайт (русский + английский) с i18n-роутингом через Next.js, переключателем языка в шапке и раздельными словарями переводов. Русский — основной язык. Английская версия содержит ключевые страницы.

---

## Что нужно сделать

### 1. Конфигурация next-intl

**Библиотека:** `next-intl` (рекомендуется для App Router)

**URL-структура (раздел 11 дизайн-спецификации):**
- `/ru/about` — русская версия
- `/en/about` — английская версия
- `/` → редирект на `/ru/` (default locale)

**Настройка:**
```typescript
// src/i18n/config.ts
export const locales = ['ru', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ru';
```

**Middleware** (`middleware.ts`):
- Определение языка: URL prefix → cookie → Accept-Language header → default (ru)
- Redirect `/about` → `/ru/about`
- Установка cookie `NEXT_LOCALE` при переключении

### 2. Словари переводов

**Файлы:** `src/i18n/messages/ru.json`, `src/i18n/messages/en.json`

**Структура словаря:**
```json
{
  "common": {
    "learnMore": "Подробнее",
    "contactUs": "Связаться с нами",
    "download": "Скачать",
    "preview": "Просмотр",
    "allNews": "Все новости",
    "readMore": "Читать далее",
    "back": "Назад",
    "next": "Далее",
    "previous": "Назад",
    "loading": "Загрузка...",
    "error": "Ошибка",
    "noResults": "Ничего не найдено"
  },
  "nav": {
    "about": "О компании",
    "services": "Услуги",
    "tariffs": "Тарифы",
    "disclosure": "Раскрытие информации",
    "news": "Новости",
    "contacts": "Контакты",
    "management": "Руководство",
    "documents": "Документы",
    "financial": "Финансовая отчётность",
    "standards": "Обязательные нормативы",
    "audit": "Аудиторские заключения",
    "risks": "Управление рисками",
    "compliance": "Комплаенс / ПОД-ФТ",
    "privacy": "Политика конфиденциальности",
    "sitemap": "Карта сайта"
  },
  "hero": {
    "title": "Простые платёжные решения для вашего бизнеса",
    "subtitle": "Расчётная небанковская кредитная организация с лицензией Банка России",
    "ctaServices": "Узнать об услугах",
    "ctaContact": "Связаться с нами"
  },
  "trust": {
    "license": "Лицензия ЦБ РФ",
    "licenseNumber": "№ 3566",
    "capital": "Уставный капитал",
    "capitalValue": "120 млн руб.",
    "encryption": "Шифрование данных",
    "encryptionValue": "TLS 1.3"
  },
  "sections": {
    "ourServices": "Наши услуги",
    "latestNews": "Новости",
    "ctaTitle": "Готовы обсудить сотрудничество?",
    "aboutCompany": "О компании",
    "tariffs": "Тарифы на услуги",
    "tariffsUpdated": "Действуют с {date}"
  },
  "contacts": {
    "title": "Контакты",
    "address": "Адрес",
    "phone": "Телефон",
    "email": "Email",
    "workingHours": "Режим работы",
    "requisites": "Реквизиты"
  },
  "form": {
    "name": "Имя",
    "namePlaceholder": "Ваше имя",
    "email": "Email",
    "emailPlaceholder": "your@email.com",
    "subject": "Тема",
    "subjectPlaceholder": "Тема обращения",
    "message": "Сообщение",
    "messagePlaceholder": "Ваше сообщение...",
    "consent": "Я согласен с {link}",
    "consentLink": "Политикой конфиденциальности",
    "submit": "Отправить сообщение",
    "submitting": "Отправка...",
    "success": "Сообщение отправлено!",
    "errorSend": "Ошибка отправки. Попробуйте позже.",
    "validation": {
      "nameRequired": "Введите имя",
      "nameMinLength": "Минимум 2 символа",
      "emailRequired": "Введите email",
      "emailInvalid": "Введите корректный email",
      "subjectRequired": "Введите тему",
      "messageRequired": "Введите сообщение",
      "messageMinLength": "Минимум 10 символов",
      "consentRequired": "Необходимо согласие"
    }
  },
  "disclosure": {
    "title": "Раскрытие информации",
    "banner": "Информация раскрывается в соответствии с ФЗ-395-1 и Указанием ЦБ РФ № 2172-У",
    "filterByYear": "Фильтр по году",
    "allYears": "Все годы",
    "categories": {
      "financial": "Финансовая отчётность",
      "standards": "Обязательные нормативы",
      "audit": "Аудиторские заключения",
      "risks": "Управление рисками",
      "charter": "Учредительные документы"
    }
  },
  "news": {
    "title": "Новости",
    "allCategories": "Все",
    "noNews": "Новостей в этой категории пока нет",
    "previousArticle": "Предыдущая новость",
    "nextArticle": "Следующая новость",
    "otherNews": "Другие новости"
  },
  "footer": {
    "description": "Расчётная небанковская кредитная организация",
    "license": "Лицензия ЦБ РФ № 3566",
    "copyright": "© {year} РНКО «Простые платежные решения»"
  },
  "accessibility": {
    "togglePanel": "Версия для слабовидящих",
    "fontSize": "Размер шрифта",
    "fontNormal": "Обычный",
    "fontLarge": "Крупный",
    "fontExtraLarge": "Очень крупный",
    "contrast": "Контрастность",
    "contrastNormal": "Обычная",
    "contrastBlackWhite": "Чёрное на белом",
    "contrastWhiteBlack": "Белое на чёрном",
    "contrastBlueYellow": "Синее на жёлтом",
    "disableImages": "Отключить изображения",
    "disableAnimations": "Отключить анимации",
    "reset": "Сбросить настройки"
  },
  "cookie": {
    "message": "Мы используем файлы cookie для улучшения работы сайта.",
    "accept": "Принять",
    "decline": "Отклонить",
    "learnMore": "Подробнее"
  }
}
```

### 3. Переключатель языка в Header

**Компонент:** `src/components/layout/LanguageSwitcher.tsx`

- Отображение: `RU / EN` (текущий язык выделен bold)
- Клик → навигация на эквивалентную страницу на другом языке
- Сохранение выбора в cookie `NEXT_LOCALE`
- На мобильном: внутри бургер-меню

### 4. Локализованный контент из CMS

- Strapi возвращает контент с `locale` фильтром
- API-функции принимают `locale` параметр (реализовано в TASK-05)
- Если перевод отсутствует — fallback на русский с пометкой «Доступно только на русском»

### 5. Английская версия — покрытие

Страницы с полным переводом (раздел 11 дизайн-спецификации):
- Главная (/)
- О компании (/about)
- Услуги (/services)
- Контакты (/contacts)

Страницы только на русском (регуляторные):
- Раскрытие информации (/disclosure и все подстраницы)
- Комплаенс (/compliance)
- Тарифы (/tariffs) — опционально на EN

### 6. SEO для мультиязычности

- `<html lang="ru">` / `<html lang="en">`
- `hreflang` теги: `<link rel="alternate" hreflang="ru" href="...">` и `<link rel="alternate" hreflang="en" href="...">`
- `sitemap.xml` включает URL обоих языков

---

## Критерии приёмки

- [ ] `/ru/about` и `/en/about` отображают контент на соответствующем языке
- [ ] Переключатель языка в header работает
- [ ] При переключении языка сохраняется текущая страница
- [ ] Cookie `NEXT_LOCALE` устанавливается
- [ ] `/` редиректит на `/ru/`
- [ ] Все строки UI переведены (нет hardcoded текстов)
- [ ] Формы валидации показывают ошибки на языке интерфейса
- [ ] `hreflang` теги присутствуют на каждой странице
- [ ] `<html lang="...">` корректен
- [ ] Fallback: на страницах без EN-контента показывается RU с пометкой

---

## Тестирование

### Unit-тесты
- LanguageSwitcher: рендер, клик → навигация с новой локалью
- Middleware: redirect / → /ru/, определение языка из cookie
- Словари: ru.json и en.json имеют одинаковую структуру ключей (тест на полноту)

### Integration-тесты
- Смена языка: /ru/about → /en/about, контент меняется
- Формы: ошибки валидации на EN отображаются по-английски

### E2E-тесты
```
e2e/i18n.spec.ts:

1. / → redirect на /ru/
2. Переключатель: RU → EN → URL меняется на /en/...
3. /en/about → заголовок на английском
4. /en/contacts → форма с английскими лейблами и плейсхолдерами
5. Переключение EN → RU → URL меняется на /ru/..., контент на русском
6. Cookie NEXT_LOCALE устанавливается после переключения
7. /en/disclosure → пометка "Available in Russian only" или redirect на /ru/disclosure
8. hreflang теги: проверить наличие в <head> для ru и en
9. <html lang> атрибут: "ru" для русской версии, "en" для английской
10. Форма на EN: пустая отправка → ошибки на английском
```
