import { createTranslator } from '@/lib/i18n';
import { Shield } from 'lucide-react';
import { Container, Section, Typography, Breadcrumbs } from '@/components/ui';

const companyRequisites = [
  { label: 'regNumber', value: '3566' },
  { label: 'inn', value: '9810007307' },
  { label: 'ogrn', value: '1267800007650' },
  { label: 'capital', value: '120 000 000 руб.' },
  { label: 'licenseType', value: 'Лицензия на осуществление банковских операций (расчётная НКО)' },
];

export default function AboutPage() {
  const t = createTranslator('ru', 'about');
  const tNav = createTranslator('ru', 'common.nav');

  const breadcrumbs = [
    { label: tNav('home'), href: '/ru' },
    { label: t('title') },
  ];

  return (
    <>
      <Section background="snow">
        <Container>
          <Breadcrumbs items={breadcrumbs} className="mb-6" />
          <Typography variant="h1" className="mb-8">{t('title')}</Typography>

          {/* Навигация по разделу */}
          <div className="flex flex-wrap gap-3 mb-12">
            <span className="px-4 py-2 bg-royal text-white rounded-button text-sm font-medium">
              {t('history')}
            </span>
            <a href="/ru/about" className="px-4 py-2 text-sm font-medium text-slate hover:text-royal transition-colors">
              {t('management')}
            </a>
            <a href="/ru/about#documents" className="px-4 py-2 text-sm font-medium text-slate hover:text-royal transition-colors">
              {t('documents')}
            </a>
          </div>

          {/* История и миссия */}
          <div className="prose max-w-none mb-12">
            <Typography variant="h2" className="mb-4">{t('history')}</Typography>
            <Typography variant="bodyLarge" color="secondary">
              {t('missionText')}
            </Typography>
          </div>

          {/* Лицензия и регистрация */}
          <div className="bg-white rounded-card border border-silver p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield size={32} className="text-royal" strokeWidth={1.5} aria-hidden="true" />
              <Typography variant="h2">{t('license')}</Typography>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {companyRequisites.map((req) => (
                <div key={req.label} className="flex flex-col">
                  <span className="text-sm text-cool-gray">{t(`licenseInfo.${req.label}`)}</span>
                  <span className="font-medium text-charcoal font-mono">{req.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
