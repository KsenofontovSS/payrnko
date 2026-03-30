'use client';

import { useState } from 'react';
import { createTranslator } from '@/lib/i18n';
import { Container, Section, Typography, Breadcrumbs, Card, Badge, Button } from '@/components/ui';
import { formatDate } from '@/lib/utils';

const mockArticles = [
  { slug: 'tariff-update-2026', title: 'Обновление тарифов на расчётные услуги', excerpt: 'С 1 апреля 2026 года вступают в силу обновлённые тарифы на расчётно-кассовое обслуживание юридических лиц.', published_date: '2026-03-25', category: 'Обновления тарифов', categorySlug: 'tariffs' },
  { slug: 'cbr-regulation-update', title: 'Изменения в нормативных актах ЦБ РФ', excerpt: 'Банк России опубликовал изменения в Положение № 851-П, касающиеся расчётных НКО.', published_date: '2026-03-20', category: 'Регуляторные изменения', categorySlug: 'regulatory' },
  { slug: 'audit-2025', title: 'РНКО ППР прошла аудиторскую проверку', excerpt: 'Компания успешно прошла ежегодную аудиторскую проверку за 2025 финансовый год.', published_date: '2026-03-15', category: 'События компании', categorySlug: 'company' },
  { slug: 'new-service-launch', title: 'Запуск нового сервиса быстрых переводов', excerpt: 'РНКО ППР запускает новый сервис мгновенных переводов для юридических лиц через СБП.', published_date: '2026-03-10', category: 'События компании', categorySlug: 'company' },
  { slug: 'cbr-meeting-2026', title: 'Участие в конференции Банка России', excerpt: 'Представители РНКО ППР приняли участие в ежегодной конференции по платёжным системам.', published_date: '2026-03-05', category: 'События компании', categorySlug: 'company' },
  { slug: 'security-update', title: 'Обновление системы информационной безопасности', excerpt: 'Завершена модернизация системы защиты информации в соответствии с требованиями ГОСТ Р 57580.', published_date: '2026-02-28', category: 'События компании', categorySlug: 'company' },
];

const categoryFilters = [
  { label: 'Все', slug: 'all' },
  { label: 'Регуляторные изменения', slug: 'regulatory' },
  { label: 'События компании', slug: 'company' },
  { label: 'Обновления тарифов', slug: 'tariffs' },
];

export default function NewsPage() {
  const t = createTranslator('ru', 'news');
  const tNav = createTranslator('ru', 'common.nav');
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? mockArticles
    : mockArticles.filter((a) => a.categorySlug === activeCategory);

  const breadcrumbs = [
    { label: tNav('home'), href: '/ru' },
    { label: t('title') },
  ];

  return (
    <Section background="snow">
      <Container>
        <Breadcrumbs items={breadcrumbs} className="mb-6" />
        <Typography variant="h1" className="mb-8">{t('title')}</Typography>

        {/* Фильтры */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categoryFilters.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-2 rounded-button text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal ${
                activeCategory === cat.slug
                  ? 'bg-royal text-white'
                  : 'bg-white text-slate border border-silver hover:border-royal hover:text-royal'
              }`}
            >
              {cat.slug === 'all' ? t('allCategories') : cat.label}
            </button>
          ))}
        </div>

        {/* Список новостей */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article) => (
              <Card key={article.slug} as="a" href={`/ru/news/${article.slug}`} className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-cool-gray">
                    {formatDate(article.published_date, 'ru')}
                  </span>
                  <Badge variant="info" size="sm">{article.category}</Badge>
                </div>
                <Typography variant="h3" className="mb-2 line-clamp-2">
                  {article.title}
                </Typography>
                <Typography variant="bodySmall" color="secondary" className="flex-1 line-clamp-3">
                  {article.excerpt}
                </Typography>
                <span className="mt-4 text-sm text-royal font-medium">
                  {t('allNews')} →
                </span>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Typography variant="body" color="secondary">{t('noNews')}</Typography>
          </div>
        )}
      </Container>
    </Section>
  );
}
