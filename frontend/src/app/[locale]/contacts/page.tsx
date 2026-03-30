import { createTranslator } from '@/lib/i18n';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Container, Section, Typography, Breadcrumbs } from '@/components/ui';
import { ContactForm } from '@/components/forms/ContactForm';

const contactInfo = {
  address: 'г. Москва, ул. Примерная, д. 1, офис 100',
  phone: '+7 (495) 123-45-67',
  email: 'info@ppr-rnko.ru',
  workingHours: 'Пн–Пт: 09:00–18:00',
  inn: '9810007307',
  ogrn: '1267800007650',
  regNumber: '3566',
};

export default function ContactsPage() {
  const t = createTranslator('ru', 'contacts');
  const tNav = createTranslator('ru', 'common.nav');

  const breadcrumbs = [
    { label: tNav('home'), href: '/' },
    { label: t('title') },
  ];

  return (
    <Section background="snow">
      <Container>
        <Breadcrumbs items={breadcrumbs} className="mb-6" />
        <Typography variant="h1" className="mb-12">{t('title')}</Typography>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Контактная информация */}
          <div>
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 rounded-lg bg-ice p-3">
                  <MapPin size={24} className="text-royal" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <div>
                  <Typography variant="bodySmall" color="secondary">{t('info.address')}</Typography>
                  <Typography variant="body">{contactInfo.address}</Typography>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 rounded-lg bg-ice p-3">
                  <Phone size={24} className="text-royal" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <div>
                  <Typography variant="bodySmall" color="secondary">{t('info.phone')}</Typography>
                  <a href={`tel:${contactInfo.phone.replace(/[\s()-]/g, '')}`} className="text-charcoal hover:text-royal transition-colors">
                    <Typography variant="body" as="span">{contactInfo.phone}</Typography>
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 rounded-lg bg-ice p-3">
                  <Mail size={24} className="text-royal" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <div>
                  <Typography variant="bodySmall" color="secondary">{t('info.email')}</Typography>
                  <a href={`mailto:${contactInfo.email}`} className="text-charcoal hover:text-royal transition-colors">
                    <Typography variant="body" as="span">{contactInfo.email}</Typography>
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 rounded-lg bg-ice p-3">
                  <Clock size={24} className="text-royal" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <div>
                  <Typography variant="bodySmall" color="secondary">{t('info.workingHours')}</Typography>
                  <Typography variant="body">{contactInfo.workingHours}</Typography>
                </div>
              </div>
            </div>

            {/* Реквизиты */}
            <div className="bg-white rounded-card border border-silver p-6">
              <Typography variant="h3" className="mb-4">{t('requisites')}</Typography>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-cool-gray">Рег. номер ЦБ РФ</span>
                  <span className="font-medium">{contactInfo.regNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cool-gray">ИНН</span>
                  <span className="font-medium">{contactInfo.inn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cool-gray">ОГРН</span>
                  <span className="font-medium">{contactInfo.ogrn}</span>
                </div>
              </div>
            </div>

            {/* Карта-заглушка */}
            <div className="mt-8 bg-silver/50 rounded-card h-[300px] lg:h-[400px] flex items-center justify-center">
              <Typography variant="body" color="secondary">
                Яндекс.Карта (подключается через API-ключ)
              </Typography>
            </div>
          </div>

          {/* Форма обратной связи */}
          <div>
            <div className="bg-white rounded-card border border-silver p-6 lg:p-8 sticky top-20">
              <Typography variant="h2" className="mb-6">{t('form.title')}</Typography>
              <ContactForm />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
