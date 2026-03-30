import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header, Footer, ScrollProgressBar } from '@/components/layout';
import { OrganizationSchema } from '@/components/layout/SchemaOrg';
import { CookieBanner } from '@/components/forms/CookieBanner';

const locales = ['ru', 'en'] as const;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: {
    template: '%s | РНКО ППР',
    default: 'РНКО «Простые платежные решения»',
  },
  description:
    'Расчётная небанковская кредитная организация. Рег. номер ЦБ РФ: 3566.',
};

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  return (
    <html lang={locale}>
      <head>
        <OrganizationSchema />
      </head>
      <body className="bg-snow text-charcoal font-sans antialiased min-h-screen flex flex-col">
        <ScrollProgressBar />
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
