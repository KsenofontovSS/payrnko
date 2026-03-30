# TASK-15: Версия для слабовидящих (a11y)

## Метаданные
- **ID:** TASK-15
- **Приоритет:** Высокий (требование ФЗ-181, ГОСТ Р 52872-2019)
- **Роли:** Frontend-разработчик, Дизайнер
- **Зависимости:** TASK-02 (дизайн-система), TASK-03 (Layout)
- **Оценка:** 3–4 дня

---

## Цель

Реализовать специальную версию сайта для пользователей с ослабленным зрением в соответствии с ФЗ-181 «О социальной защите инвалидов» и ГОСТ Р 52872-2019. Панель настроек доступна из шапки сайта.

---

## Что нужно сделать

### 1. Панель настроек доступности (`src/components/accessibility/AccessibilityPanel.tsx`)

**Триггер:** кнопка с иконкой глаза (Eye) в правом верхнем углу шапки.

**Открытие:** dropdown-панель или боковая панель (slide-in).

**Настройки (раздел 10 дизайн-спецификации):**

#### 1.1. Размер шрифта — 3 уровня
| Уровень | Множитель | Описание |
|---------|-----------|----------|
| Обычный | 100% | По умолчанию |
| Крупный | 150% | Увеличенный |
| Очень крупный | 200% | Максимальный |

Реализация: CSS-переменная `--a11y-font-scale` на `<html>`, все размеры через `rem`.

#### 1.2. Высококонтрастные темы
| Тема | Фон | Текст | Ссылки |
|------|-----|-------|--------|
| Обычная | Без изменений | Без изменений | Без изменений |
| Чёрное на белом | `#FFFFFF` | `#000000` | `#0000FF` |
| Белое на чёрном | `#000000` | `#FFFFFF` | `#FFFF00` |
| Синее на жёлтом | `#FFFF00` | `#0000FF` | `#FF0000` |

Реализация: CSS-класс на `<html>` (`a11y-high-contrast-bw`, `a11y-high-contrast-wb`, `a11y-high-contrast-by`), переопределение CSS-переменных.

#### 1.3. Отключение изображений
- Toggle: вкл/выкл
- При включении: все `<img>` и фоновые изображения скрываются
- Текст `alt` отображается вместо изображений
- Реализация: CSS-класс `a11y-no-images` → `img { display: none }`, `[data-alt]::before { content: attr(data-alt) }`

#### 1.4. Отключение анимаций
- Toggle: вкл/выкл
- Эквивалент `prefers-reduced-motion: reduce`
- Реализация: CSS-класс `a11y-no-animations` → `*, *::before, *::after { animation: none !important; transition: none !important; }`

### 2. Состояние настроек (`src/hooks/useAccessibility.ts`)

**Хранение:** `localStorage` (сохраняется между визитами)

```typescript
interface AccessibilityState {
  fontSize: 'normal' | 'large' | 'extra-large';
  contrast: 'normal' | 'black-white' | 'white-black' | 'blue-yellow';
  imagesDisabled: boolean;
  animationsDisabled: boolean;
}
```

**Хук:**
```typescript
function useAccessibility(): {
  state: AccessibilityState;
  setFontSize: (size: AccessibilityState['fontSize']) => void;
  setContrast: (theme: AccessibilityState['contrast']) => void;
  toggleImages: () => void;
  toggleAnimations: () => void;
  reset: () => void;
}
```

### 3. CSS-реализация (`src/styles/accessibility.css`)

```css
/* Размер шрифта */
html.a11y-font-large { font-size: 150%; }
html.a11y-font-extra-large { font-size: 200%; }

/* Высокий контраст: чёрное на белом */
html.a11y-contrast-bw {
  --color-bg: #FFFFFF;
  --color-text: #000000;
  --color-link: #0000FF;
  --color-border: #000000;
}
html.a11y-contrast-bw * {
  background-color: var(--color-bg) !important;
  color: var(--color-text) !important;
  border-color: var(--color-border) !important;
}
html.a11y-contrast-bw a { color: var(--color-link) !important; text-decoration: underline !important; }

/* Аналогично для wb и by тем */

/* Отключение изображений */
html.a11y-no-images img,
html.a11y-no-images [style*="background-image"] {
  visibility: hidden;
}

/* Отключение анимаций */
html.a11y-no-animations *,
html.a11y-no-animations *::before,
html.a11y-no-animations *::after {
  animation-duration: 0s !important;
  transition-duration: 0s !important;
}
```

### 4. Кнопка сброса

«Сбросить настройки» — возврат к стандартной теме. Очистка localStorage.

### 5. Интерактивные области

При включении версии для слабовидящих — минимальный размер интерактивных элементов **48×48px** (WCAG 2.5.8). Реализация: увеличение padding кнопок и ссылок.

### 6. Совместимость со скринридерами

- Все изображения с `alt`
- `aria-live="polite"` для динамического контента
- `role="alert"` для сообщений об ошибках
- Skip navigation link
- Landmark roles: `<header>`, `<nav>`, `<main>`, `<footer>`
- Корректный tab order
- `aria-label` для иконок-кнопок (бургер, поиск, a11y toggle)

---

## Дизайнеру

- Макет панели настроек доступности (dropdown или sidebar)
- Визуализация 4 контрастных тем (скриншот главной в каждой теме)
- Стиль переключателей (toggle switches) и кнопок выбора размера шрифта
- Макет кнопки-триггера (иконка глаза) в header

---

## Критерии приёмки

- [ ] Кнопка-триггер видна в header на всех страницах
- [ ] Панель открывается и закрывается
- [ ] 3 уровня размера шрифта работают (текст реально увеличивается)
- [ ] 4 контрастные темы работают (фон и текст меняются)
- [ ] Отключение изображений: все `img` скрыты
- [ ] Отключение анимаций: анимации не проигрываются
- [ ] Настройки сохраняются в localStorage между визитами
- [ ] Кнопка «Сбросить» возвращает к обычной версии
- [ ] Минимальный размер touch target 48×48px при включённой версии
- [ ] Совместимость с NVDA (базовая проверка: навигация по заголовкам, чтение контента)
- [ ] axe-core: 0 critical/serious на всех страницах

---

## Тестирование

### Unit-тесты
- `useAccessibility` хук: начальное состояние, изменение каждого параметра, reset
- localStorage: значения сохраняются и считываются
- AccessibilityPanel: рендер всех контролов, клик → состояние меняется

### Integration-тесты
- Включение «Крупный шрифт» → проверка CSS-класса на `<html>`
- Включение «Белое на чёрном» → фон body чёрный, текст белый
- Включение «Без изображений» → `<img>` не видимы

### E2E-тесты
```
e2e/accessibility.spec.ts:

1. Кнопка-триггер в header видна и кликабельна
2. Панель настроек открывается при клике
3. Размер шрифта "Крупный" → текст увеличивается (font-size > 16px на body)
4. Тема "Белое на чёрном" → background-color body = чёрный
5. Отключение изображений → img элементы скрыты
6. Отключение анимаций → transition-duration = 0s
7. Кнопка "Сбросить" → все настройки возвращаются к дефолтным
8. Перезагрузка страницы → настройки сохранились (localStorage)
9. axe-core audit: score ≥ 90 на главной странице
10. Tab navigation: фокус переходит по всем интерактивным элементам
11. Skip link: Tab → Enter → фокус на main content
12. Контраст текста: проверить через Lighthouse accessibility
```
