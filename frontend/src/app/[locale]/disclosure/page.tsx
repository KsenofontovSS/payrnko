'use client';

import { useState } from 'react';
import { createTranslator } from '@/lib/i18n';
import { Info } from 'lucide-react';
import { Container, Section, Typography, Breadcrumbs, DocumentCard } from '@/components/ui';
import type { DocumentCategory } from '@/types/api';

interface MockDocument {
  title: string;
  category: DocumentCategory;
  date: string;
  year: number;
  format: string;
  fileSize: string;
  downloadUrl: string;
}

const mockDocuments: MockDocument[] = [
  { title: 'Годовая бухгалтерская отчётность 2025', category: 'financial', date: '15.03.2026', year: 2025, format: 'PDF', fileSize: '2.4 МБ', downloadUrl: '#' },
  { title: 'Квартальная отчётность Q4 2025', category: 'financial', date: '01.02.2026', year: 2025, format: 'PDF', fileSize: '1.8 МБ', downloadUrl: '#' },
  { title: 'Квартальная отчётность Q3 2025', category: 'financial', date: '01.11.2025', year: 2025, format: 'PDF', fileSize: '1.6 МБ', downloadUrl: '#' },
  { title: 'Нормативы достаточности капитала', category: 'standards', date: '01.01.2026', year: 2026, format: 'PDF', fileSize: '890 КБ', downloadUrl: '#' },
  { title: 'Нормативы ликвидности', category: 'standards', date: '01.01.2026', year: 2026, format: 'PDF', fileSize: '720 КБ', downloadUrl: '#' },
  { title: 'Аудиторское заключение за 2025 год', category: 'audit', date: '20.03.2026', year: 2025, format: 'PDF', fileSize: '3.1 МБ', downloadUrl: '#' },
  { title: 'Политика управления рисками', category: 'risks', date: '01.01.2026', year: 2026, format: 'PDF', fileSize: '1.2 МБ', downloadUrl: '#' },
  { title: 'Устав РНКО ППР', category: 'charter', date: '15.06.2024', year: 2024, format: 'PDF', fileSize: '560 КБ', downloadUrl: '#' },
  { title: 'Свидетельство о регистрации', category: 'charter', date: '01.01.2024', year: 2024, format: 'PDF', fileSize: '340 КБ', downloadUrl: '#' },
];

const categoryKeys: DocumentCategory[] = ['financial', 'standards', 'audit', 'risks', 'charter'];
const years = [2026, 2025, 2024];

export default function DisclosurePage() {
  const t = createTranslator('ru', 'disclosure');
  const tNav = createTranslator('ru', 'common.nav');
  const [activeCategory, setActiveCategory] = useState<DocumentCategory | 'all'>('all');
  const [activeYear, setActiveYear] = useState<number | 'all'>('all');

  const filtered = mockDocuments.filter((doc) => {
    if (activeCategory !== 'all' && doc.category !== activeCategory) return false;
    if (activeYear !== 'all' && doc.year !== activeYear) return false;
    return true;
  });

  const breadcrumbs = [
    { label: tNav('home'), href: '/' },
    { label: t('title') },
  ];

  return (
    <Section background="snow">
      <Container>
        <Breadcrumbs items={breadcrumbs} className="mb-6" />
        <Typography variant="h1" className="mb-4">{t('title')}</Typography>
        <Typography variant="bodyLarge" color="secondary" className="mb-8 max-w-3xl">
          {t('description')}
        </Typography>

        {/* Информационный баннер */}
        <div className="flex items-start gap-3 bg-ice border border-sky-accent/30 rounded-card p-4 mb-8">
          <Info size={24} className="text-info flex-shrink-0 mt-0.5" strokeWidth={1.5} aria-hidden="true" />
          <Typography variant="bodySmall" color="secondary">
            Раскрытие информации осуществляется в соответствии с Федеральным законом № 395-1 «О банках и банковской деятельности», Указанием Банка России № 2172-У и Положением № 851-П.
          </Typography>
        </div>

        {/* Фильтры */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* По категории */}
          <div>
            <label className="text-sm text-cool-gray mb-2 block">{t('filterByCategory')}</label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 rounded-button text-xs font-medium transition-colors ${
                  activeCategory === 'all' ? 'bg-royal text-white' : 'bg-white text-slate border border-silver hover:border-royal'
                }`}
              >
                Все
              </button>
              {categoryKeys.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-button text-xs font-medium transition-colors ${
                    activeCategory === cat ? 'bg-royal text-white' : 'bg-white text-slate border border-silver hover:border-royal'
                  }`}
                >
                  {t(`categories.${cat}`)}
                </button>
              ))}
            </div>
          </div>

          {/* По году */}
          <div>
            <label className="text-sm text-cool-gray mb-2 block">{t('filterByYear')}</label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveYear('all')}
                className={`px-3 py-1.5 rounded-button text-xs font-medium transition-colors ${
                  activeYear === 'all' ? 'bg-royal text-white' : 'bg-white text-slate border border-silver hover:border-royal'
                }`}
              >
                {t('allYears')}
              </button>
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setActiveYear(year)}
                  className={`px-3 py-1.5 rounded-button text-xs font-medium transition-colors ${
                    activeYear === year ? 'bg-royal text-white' : 'bg-white text-slate border border-silver hover:border-royal'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Документы */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((doc, i) => (
              <DocumentCard
                key={i}
                title={doc.title}
                date={doc.date}
                format={doc.format}
                fileSize={doc.fileSize}
                downloadUrl={doc.downloadUrl}
                category={t(`categories.${doc.category}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Typography variant="body" color="secondary">{t('noDocuments')}</Typography>
          </div>
        )}
      </Container>
    </Section>
  );
}
