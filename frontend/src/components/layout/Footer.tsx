import Link from 'next/link';
import { createTranslator } from '@/lib/i18n';
import { Container } from '@/components/ui';

const footerLinks = {
  company: [
    { label: 'О компании', href: '/about' },
    { label: 'Услуги', href: '/services' },
    { label: 'Тарифы', href: '/tariffs' },
    { label: 'Новости', href: '/news' },
    { label: 'Контакты', href: '/contacts' },
  ],
  disclosure: [
    { label: 'Финансовая отчётность', href: '/disclosure' },
    { label: 'Нормативы', href: '/disclosure#standards' },
    { label: 'Аудит', href: '/disclosure#audit' },
    { label: 'Управление рисками', href: '/disclosure#risks' },
  ],
};

export function Footer() {
  const t = createTranslator('ru', 'common');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-primary text-white" role="contentinfo">
      <Container>
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Колонка 1: Логотип и описание */}
          <div>
            <Link href="/" className="text-xl font-bold">
              <span className="text-sky-accent">РНКО</span> ППР
            </Link>
            <p className="mt-4 text-sm text-cool-gray leading-relaxed">
              Расчётная небанковская кредитная организация «Простые платежные решения» (ООО)
            </p>
            <p className="mt-3 text-xs text-cool-gray">
              {t('footer.license')}
            </p>
          </div>

          {/* Колонка 2: О компании */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              {t('nav.about')}
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cool-gray hover:text-white transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Колонка 3: Раскрытие информации */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              {t('nav.disclosure')}
            </h3>
            <ul className="space-y-2">
              {footerLinks.disclosure.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cool-gray hover:text-white transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Колонка 4: Контакты */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              {t('nav.contacts')}
            </h3>
            <address className="not-italic space-y-2 text-sm text-cool-gray">
              <p>г. Москва, ул. Примерная, д. 1</p>
              <p>
                <a
                  href="tel:+74951234567"
                  className="hover:text-white transition-colors duration-200"
                >
                  +7 (495) 123-45-67
                </a>
              </p>
              <p>
                <a
                  href="mailto:info@ppr-rnko.ru"
                  className="hover:text-white transition-colors duration-200"
                >
                  info@ppr-rnko.ru
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="border-t border-white/10 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cool-gray">
          <p>{t('footer.copyright', { year })}</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors duration-200">
              {t('footer.privacy')}
            </Link>
            <Link href="/sitemap" className="hover:text-white transition-colors duration-200">
              Карта сайта
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
