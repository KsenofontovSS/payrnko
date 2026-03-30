# TASK-02: Дизайн-система и UI Kit

## Метаданные
- **ID:** TASK-02
- **Приоритет:** Критический
- **Роли:** Frontend-разработчик, Дизайнер, Верстальщик
- **Зависимости:** TASK-01
- **Оценка:** 4–6 дней

---

## Цель

Создать библиотеку переиспользуемых UI-компонентов — дизайн-систему проекта. Все компоненты типизированы, документированы, покрыты тестами и стилизованы через Tailwind CSS в соответствии с палитрой и типографикой из дизайн-спецификации.

---

## Что нужно сделать

### 1. Компонент `Button`

**Файл:** `src/components/ui/Button.tsx`

4 варианта (см. таблицу 7.1 дизайн-спецификации):

| Вариант | Фон | Текст | Border | Hover |
|---------|-----|-------|--------|-------|
| `primary` | `#2B6CB0` | `#FFFFFF` | нет | darken 10% |
| `secondary` | transparent | `#2B6CB0` | `1px #2B6CB0` | bg `#EBF8FF` |
| `ghost` | transparent | `#2B6CB0` | нет | underline |
| `cta` | `#FFFFFF` | `#1A365D` | нет | bg `#EBF8FF`, тень |

Пропсы:
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'cta';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  href?: string;          // Если передан — рендерить как <Link>
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode; // Иконка слева
  className?: string;
  type?: 'button' | 'submit';
  ariaLabel?: string;
}
```

Стиль:
- `border-radius: 8px`
- Padding: sm=`8px 16px`, md=`12px 28px`, lg=`16px 36px`
- Transition: `all 200ms ease`
- Focus: видимый outline (2px solid #2B6CB0, offset 2px)
- Disabled: opacity 0.5, cursor not-allowed

### 2. Компонент `Card`

**Файл:** `src/components/ui/Card.tsx`

Стиль (раздел 7.2 дизайн-спецификации):
- Фон: `#FFFFFF`
- `border-radius: 12px`
- Граница: `1px solid #E2E8F0` ИЛИ тень: `0 1px 3px rgba(0,0,0,0.1)`
- Hover: тень `0 4px 12px rgba(0,0,0,0.1)`, `translateY(-2px)`, transition `300ms ease`
- Padding: 24px

Пропсы:
```typescript
interface CardProps {
  children: React.ReactNode;
  hoverable?: boolean;     // Включить hover-эффект (по умолчанию true)
  className?: string;
  onClick?: () => void;
  as?: 'div' | 'article' | 'a';
  href?: string;
}
```

### 3. Компонент `Icon`

**Файл:** `src/components/ui/Icon.tsx`

Обёртка над Lucide Icons. Размеры по спецификации (раздел 7.3):
- `sm` = 24px (inline)
- `md` = 32px (карточки услуг)
- `lg` = 48px (блок доверия)

```typescript
interface IconProps {
  name: string;           // Имя иконки Lucide
  size?: 'sm' | 'md' | 'lg';
  color?: 'accent' | 'neutral' | 'white' | 'success' | 'error';
  className?: string;
  ariaLabel?: string;     // Обязателен, если иконка не декоративная
}
```

Цвета: accent = `#2B6CB0`, neutral = `#4A5568`, white = `#FFFFFF`.

Stroke-width: `1.5` (по спецификации).

### 4. Компонент `Typography`

**Файл:** `src/components/ui/Typography.tsx`

Реализовать типографическую шкалу (раздел 3.2):

```typescript
type TypographyVariant = 
  | 'hero'       // 48–56px, 700, 1.1
  | 'h1'         // 36–40px, 700, 1.2
  | 'h2'         // 28–32px, 600, 1.3
  | 'h3'         // 22–24px, 600, 1.4
  | 'bodyLarge'  // 18px, 400, 1.7
  | 'body'       // 16px, 400, 1.6
  | 'bodySmall'  // 14px, 400, 1.5
  | 'caption';   // 12px, 400, 1.4

interface TypographyProps {
  variant: TypographyVariant;
  as?: keyof JSX.IntrinsicElements; // Тег HTML (h1, h2, p, span...)
  children: React.ReactNode;
  className?: string;
  color?: 'default' | 'secondary' | 'accent' | 'white';
}
```

Шрифт: **Inter** (заголовки и текст), **JetBrains Mono** для реквизитов (`font-mono`).

### 5. Компонент `Badge`

**Файл:** `src/components/ui/Badge.tsx`

Для тегов новостей, статусов, рубрик.

```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}
```

### 6. Компонент `Accordion`

**Файл:** `src/components/ui/Accordion.tsx`

Для FAQ, раскрытия информации. Анимация expand/collapse через Framer Motion (300ms ease, как в разделе 8.1).

```typescript
interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;  // Можно ли открыть несколько секций
  className?: string;
}
```

### 7. Компонент `Table`

**Файл:** `src/components/ui/Table.tsx`

Для тарифов и раскрытия информации. Sticky header при скролле.

```typescript
interface TableColumn<T> {
  key: keyof T;
  header: string;
  width?: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  stickyHeader?: boolean;
  striped?: boolean;       // Чередование фона строк
  className?: string;
}
```

### 8. Компонент `DocumentCard`

**Файл:** `src/components/ui/DocumentCard.tsx`

Для списков документов (PDF) в разделе раскрытия.

```typescript
interface DocumentCardProps {
  title: string;
  date: string;
  format: string;         // "PDF", "XLSX"
  fileSize?: string;
  downloadUrl: string;
  previewUrl?: string;    // URL для PDF.js превью
  category?: string;
}
```

### 9. Компонент `Container`

**Файл:** `src/components/ui/Container.tsx`

Обёртка для ограничения ширины контента: `max-width: 1200px`, центрирование, padding по бокам.

### 10. Компонент `Section`

**Файл:** `src/components/ui/Section.tsx`

Секция страницы с вертикальными отступами и опциональным фоном.

```typescript
interface SectionProps {
  children: React.ReactNode;
  background?: 'white' | 'ice' | 'snow' | 'gradient';
  className?: string;
  id?: string;
}
```

### 11. Компонент `Breadcrumbs`

**Файл:** `src/components/ui/Breadcrumbs.tsx`

Хлебные крошки для внутренних страниц. Поддержка микроразметки `BreadcrumbList` (Schema.org).

---

## Дизайнеру

- Все компоненты оформляются в Figma как компоненты с Auto Layout.
- Каждый компонент имеет состояния: Default, Hover, Focus, Active, Disabled.
- Используйте Figma Variables для цветовых токенов.
- Экспорт: токены в JSON + иконки в SVG.
- Страница в Figma: "🧱 UI Kit" со всеми компонентами и их вариантами.

---

## Верстальщику

- Все компоненты стилизуются через Tailwind CSS utility-классы.
- Кастомные значения (цвета, шрифты, тени) берутся из `tailwind.config.ts`, НЕ хардкодятся.
- Каждый компонент адаптивен. Проверять на 320px, 768px, 1024px, 1280px.
- Focus-стили обязательны для всех интерактивных элементов.
- Не использовать `px` в Tailwind — использовать шкалу spacing.

---

## Критерии приёмки

- [ ] Все 11 компонентов реализованы и экспортируются из `src/components/ui/index.ts`
- [ ] Каждый компонент полностью типизирован (TypeScript, без `any`)
- [ ] Цвета соответствуют палитре из дизайн-спецификации (раздел 2)
- [ ] Типографика соответствует шкале (раздел 3.2)
- [ ] Hover/Focus/Disabled-состояния работают корректно
- [ ] Компоненты адаптивны (проверка на 4 брейкпоинтах)
- [ ] Анимации работают и отключаются при `prefers-reduced-motion: reduce`
- [ ] Все интерактивные элементы доступны с клавиатуры (Tab, Enter, Space)
- [ ] `aria-label` / `aria-expanded` / `role` установлены где нужно

---

## Тестирование

### Unit-тесты (для каждого компонента)
- Рендеринг с обязательными пропсами
- Рендеринг всех вариантов (variant, size)
- Обработка кликов (onClick вызывается)
- Disabled-состояние (клик не срабатывает, visually disabled)
- Корректный HTML-тег (as prop)
- Наличие `aria-*` атрибутов

### Accessibility-тесты
- axe-core проверка для каждого компонента (0 critical/serious)
- Проверка контраста текста (4.5:1 минимум)
- Keyboard navigation: Tab переключает фокус, Enter/Space активирует

### E2E-тесты
```
e2e/ui-kit.spec.ts:
- Рендер страницы с каждым компонентом (storybook или тестовая страница)
- Визуальный регрессионный тест: скриншот каждого компонента на 3 разрешениях
- Hover-эффект на Card: translateY и тень изменяются
- Accordion: клик раскрывает/сворачивает секцию, анимация проигрывается
- Button: клик по disabled-кнопке не вызывает действие
```
