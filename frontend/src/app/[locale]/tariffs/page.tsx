'use client';

import { useState } from 'react';
import { createTranslator } from '@/lib/i18n';
import { Container, Section, Typography, Breadcrumbs, Table } from '@/components/ui';

interface TariffRow {
  service_name: string;
  category: string;
  price: string;
  effective_date: string;
  [key: string]: unknown;
}

const mockTariffs: TariffRow[] = [
  { service_name: 'Открытие расчётного счёта', category: 'Расчётные операции', price: 'Бесплатно', effective_date: '2026-01-01' },
  { service_name: 'Ведение расчётного счёта', category: 'Расчётные операции', price: 'от 1 500 руб./мес.', effective_date: '2026-01-01' },
  { service_name: 'Платёжное поручение (электронно)', category: 'Расчётные операции', price: '25 руб.', effective_date: '2026-01-01' },
  { service_name: 'Платёжное поручение (бумажно)', category: 'Расчётные операции', price: '150 руб.', effective_date: '2026-01-01' },
  { service_name: 'Внесение наличных', category: 'Кассовое обслуживание', price: '0.1% от суммы', effective_date: '2026-01-01' },
  { service_name: 'Выдача наличных', category: 'Кассовое обслуживание', price: '0.5% от суммы', effective_date: '2026-01-01' },
  { service_name: 'Покупка валюты', category: 'Валютные операции', price: 'По курсу + 0.3%', effective_date: '2026-01-01' },
  { service_name: 'Продажа валюты', category: 'Валютные операции', price: 'По курсу + 0.3%', effective_date: '2026-01-01' },
  { service_name: 'Инкассация (в пределах МКАД)', category: 'Инкассация', price: 'от 3 000 руб.', effective_date: '2026-01-01' },
  { service_name: 'Выписка по счёту', category: 'Прочее', price: 'Бесплатно', effective_date: '2026-01-01' },
];

const categories = ['Все', 'Расчётные операции', 'Кассовое обслуживание', 'Валютные операции', 'Инкассация', 'Прочее'];

export default function TariffsPage() {
  const t = createTranslator('ru', 'tariffs');
  const tNav = createTranslator('ru', 'common.nav');
  const [activeCategory, setActiveCategory] = useState('Все');

  const filtered = activeCategory === 'Все'
    ? mockTariffs
    : mockTariffs.filter((row) => row.category === activeCategory);

  const breadcrumbs = [
    { label: tNav('home'), href: '/ru' },
    { label: t('title') },
  ];

  const columns = [
    { key: 'service_name' as keyof TariffRow, header: t('serviceName') },
    { key: 'category' as keyof TariffRow, header: t('category') },
    { key: 'price' as keyof TariffRow, header: t('price') },
  ];

  return (
    <Section background="snow">
      <Container>
        <Breadcrumbs items={breadcrumbs} className="mb-6" />
        <div className="flex items-start justify-between mb-4">
          <div>
            <Typography variant="h1" className="mb-2">{t('title')}</Typography>
            <Typography variant="bodySmall" color="secondary">
              {t('lastUpdated')}: 1 января 2026
            </Typography>
          </div>
        </div>
        <Typography variant="bodyLarge" color="secondary" className="mb-8 max-w-3xl">
          {t('description')}
        </Typography>

        {/* Фильтры */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-button text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal ${
                activeCategory === cat
                  ? 'bg-royal text-white'
                  : 'bg-white text-slate border border-silver hover:border-royal hover:text-royal'
              }`}
            >
              {cat === 'Все' ? t('allCategories') : cat}
            </button>
          ))}
        </div>

        {/* Таблица (desktop) */}
        <div className="hidden md:block">
          <Table columns={columns} data={filtered} stickyHeader striped />
        </div>

        {/* Карточки (mobile) */}
        <div className="md:hidden space-y-4">
          {filtered.map((row, i) => (
            <div key={i} className="bg-white rounded-card border border-silver p-4">
              <Typography variant="body" className="font-medium mb-1">{row.service_name}</Typography>
              <Typography variant="bodySmall" color="secondary" className="mb-2">{row.category}</Typography>
              <Typography variant="body" color="accent" className="font-semibold">{row.price}</Typography>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
