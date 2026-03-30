import { useTranslations } from 'next-intl';
import { HeroSection, ServicesSection, TrustSection, NewsPreviewSection, CTASection } from '@/components/sections';
import type { Service, NewsArticle } from '@/types/api';

// Моковые данные — будут заменены на CMS при подключении
const mockServices: (Service & { id: number })[] = [
  { id: 1, title: 'Открытие и ведение счетов', slug: 'bank-accounts', short_description: 'Открытие и ведение банковских счетов юридических лиц, индивидуальных предпринимателей.', full_description: '', icon_name: 'CreditCard', order: 1, locale: 'ru' },
  { id: 2, title: 'Расчётные операции', slug: 'settlements', short_description: 'Осуществление расчётов по поручению юридических лиц по их банковским счетам.', full_description: '', icon_name: 'ArrowRightLeft', order: 2, locale: 'ru' },
  { id: 3, title: 'Денежные переводы', slug: 'transfers', short_description: 'Переводы денежных средств без открытия банковского счёта, включая электронные денежные средства.', full_description: '', icon_name: 'Banknote', order: 3, locale: 'ru' },
  { id: 4, title: 'Инкассация', slug: 'collection', short_description: 'Инкассация денежных средств, векселей, платёжных и расчётных документов.', full_description: '', icon_name: 'Truck', order: 4, locale: 'ru' },
  { id: 5, title: 'Кассовое обслуживание', slug: 'cash-services', short_description: 'Кассовое обслуживание юридических лиц и индивидуальных предпринимателей.', full_description: '', icon_name: 'Wallet', order: 5, locale: 'ru' },
  { id: 6, title: 'Валютные операции', slug: 'currency', short_description: 'Купля-продажа иностранной валюты в безналичной форме для юридических лиц.', full_description: '', icon_name: 'Globe', order: 6, locale: 'ru' },
];

const mockNews: (NewsArticle & { id: number })[] = [
  { id: 1, title: 'Обновление тарифов на расчётные услуги', slug: 'tariff-update-2026', excerpt: 'С 1 апреля 2026 года вступают в силу обновлённые тарифы на расчётно-кассовое обслуживание.', content: '', cover_image: { data: null }, category: { data: { id: 1, attributes: { name: 'Обновления тарифов', slug: 'tariffs' } } }, published_date: '2026-03-25', locale: 'ru', is_featured: true },
  { id: 2, title: 'Изменения в нормативных актах ЦБ РФ', slug: 'cbr-regulation-update', excerpt: 'Банк России опубликовал изменения в Положение № 851-П, касающиеся расчётных НКО.', content: '', cover_image: { data: null }, category: { data: { id: 2, attributes: { name: 'Регуляторные изменения', slug: 'regulatory' } } }, published_date: '2026-03-20', locale: 'ru', is_featured: false },
  { id: 3, title: 'РНКО ППР прошла аудиторскую проверку', slug: 'audit-2025', excerpt: 'Компания успешно прошла ежегодную аудиторскую проверку за 2025 финансовый год.', content: '', cover_image: { data: null }, category: { data: { id: 3, attributes: { name: 'События компании', slug: 'company' } } }, published_date: '2026-03-15', locale: 'ru', is_featured: false },
];

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <>
      <HeroSection
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        ctaServices={t('hero.ctaServices')}
        ctaContacts={t('hero.ctaContacts')}
      />
      <ServicesSection services={mockServices} title={t('services.title')} />
      <TrustSection />
      <NewsPreviewSection
        news={mockNews}
        title={t('news.title')}
        viewAllLabel={t('news.viewAll')}
        locale="ru"
      />
      <CTASection
        title={t('cta.title')}
        buttonLabel={t('cta.button')}
      />
    </>
  );
}
