import { createTranslator } from '@/lib/i18n';
import { Container, Section, Typography, Breadcrumbs, Card, Icon, Button } from '@/components/ui';
import type { Service } from '@/types/api';

const mockServices: (Service & { id: number })[] = [
  { id: 1, title: 'Открытие и ведение счетов', slug: 'bank-accounts', short_description: 'Открытие и ведение банковских счетов юридических лиц, индивидуальных предпринимателей.', full_description: 'Полное описание услуги по открытию и ведению банковских счетов.', icon_name: 'CreditCard', order: 1, locale: 'ru' },
  { id: 2, title: 'Расчётные операции', slug: 'settlements', short_description: 'Осуществление расчётов по поручению юридических лиц по их банковским счетам.', full_description: '', icon_name: 'ArrowRightLeft', order: 2, locale: 'ru' },
  { id: 3, title: 'Денежные переводы', slug: 'transfers', short_description: 'Переводы денежных средств без открытия банковского счёта.', full_description: '', icon_name: 'Banknote', order: 3, locale: 'ru' },
  { id: 4, title: 'Инкассация', slug: 'collection', short_description: 'Инкассация денежных средств, векселей, платёжных и расчётных документов.', full_description: '', icon_name: 'Truck', order: 4, locale: 'ru' },
  { id: 5, title: 'Кассовое обслуживание', slug: 'cash-services', short_description: 'Кассовое обслуживание юридических лиц и индивидуальных предпринимателей.', full_description: '', icon_name: 'Wallet', order: 5, locale: 'ru' },
  { id: 6, title: 'Валютные операции', slug: 'currency', short_description: 'Купля-продажа иностранной валюты в безналичной форме.', full_description: '', icon_name: 'Globe', order: 6, locale: 'ru' },
];

export default function ServicesPage() {
  const t = createTranslator('ru', 'services');
  const tNav = createTranslator('ru', 'common.nav');

  const breadcrumbs = [
    { label: tNav('home'), href: '/ru' },
    { label: t('title') },
  ];

  return (
    <Section background="snow">
      <Container>
        <Breadcrumbs items={breadcrumbs} className="mb-6" />
        <Typography variant="h1" className="mb-4">{t('catalog')}</Typography>
        <Typography variant="bodyLarge" color="secondary" className="mb-12 max-w-3xl">
          {t('description')}
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockServices.map((service) => (
            <Card key={service.slug} hoverable className="flex flex-col h-full">
              <div className="mb-4">
                <Icon name={service.icon_name} size="lg" color="accent" />
              </div>
              <Typography variant="h3" className="mb-3">
                {service.title}
              </Typography>
              <Typography variant="bodySmall" color="secondary" className="mb-4 flex-1">
                {service.short_description}
              </Typography>
              <Button variant="ghost" size="sm" href={`/ru/services/${service.slug}`}>
                Подробнее →
              </Button>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
