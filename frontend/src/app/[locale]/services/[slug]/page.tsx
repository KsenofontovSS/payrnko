import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Container, Section, Typography, Breadcrumbs, Button } from '@/components/ui';
import { CTASection } from '@/components/sections';

const mockServices = [
  { slug: 'bank-accounts', title: 'Открытие и ведение счетов', icon_name: 'CreditCard', description: 'Открытие и ведение банковских счетов юридических лиц и индивидуальных предпринимателей. Мы предоставляем полный спектр услуг по обслуживанию расчётных счетов, включая дистанционное банковское обслуживание.' },
  { slug: 'settlements', title: 'Расчётные операции', icon_name: 'ArrowRightLeft', description: 'Осуществление расчётов по поручению юридических лиц по их банковским счетам. Быстрая обработка платёжных поручений и проведение расчётных операций.' },
  { slug: 'transfers', title: 'Денежные переводы', icon_name: 'Banknote', description: 'Переводы денежных средств без открытия банковского счёта, включая электронные денежные средства. Быстрые и надёжные переводы по России.' },
  { slug: 'collection', title: 'Инкассация', icon_name: 'Truck', description: 'Инкассация денежных средств, векселей, платёжных и расчётных документов. Профессиональные услуги инкассации для вашего бизнеса.' },
  { slug: 'cash-services', title: 'Кассовое обслуживание', icon_name: 'Wallet', description: 'Кассовое обслуживание юридических лиц и индивидуальных предпринимателей. Приём и выдача наличных денежных средств.' },
  { slug: 'currency', title: 'Валютные операции', icon_name: 'Globe', description: 'Купля-продажа иностранной валюты в безналичной форме для юридических лиц. Конкурентные курсы обмена валют.' },
];

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const service = mockServices.find((s) => s.slug === params.slug);
  if (!service) notFound();

  const t = useTranslations('services');
  const tNav = useTranslations('common.nav');

  const breadcrumbs = [
    { label: tNav('home'), href: '/' },
    { label: t('title'), href: '/services' },
    { label: service.title },
  ];

  const otherServices = mockServices.filter((s) => s.slug !== params.slug);

  return (
    <>
      <Section background="snow">
        <Container>
          <Breadcrumbs items={breadcrumbs} className="mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Основной контент */}
            <div className="lg:col-span-2">
              <Typography variant="h1" className="mb-6">
                {service.title}
              </Typography>
              <div className="prose max-w-none">
                <Typography variant="bodyLarge" color="secondary">
                  {service.description}
                </Typography>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-20 bg-white rounded-card border border-silver p-6">
                <Typography variant="h3" className="mb-4">
                  {t('otherServices')}
                </Typography>
                <nav className="space-y-2">
                  {otherServices.map((s) => (
                    <a
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="block text-sm text-slate hover:text-royal transition-colors duration-200 py-1"
                    >
                      {s.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <CTASection title={t('ctaTitle')} buttonLabel={t('ctaButton')} />
    </>
  );
}
