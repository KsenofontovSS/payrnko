import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Header, Footer, ScrollProgressBar } from '@/components/layout';
import { OrganizationSchema } from '@/components/layout/SchemaOrg';
import { CookieBanner } from '@/components/forms/CookieBanner';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-mono',
  display: 'swap',
});

const locales = ['ru', 'en'] as const;

export const metadata: Metadata = {
  title: {
    template: '%s | РНКО ППР',
    default: 'РНКО «Простые платежные решения»',
  },
  description:
    'Расчётная небанковская кредитная организация. Рег. номер ЦБ РФ: 3566.',
};

export default async function LocaleLayout({
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

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <OrganizationSchema />
      </head>
      <body className="bg-snow text-charcoal font-sans antialiased min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <ScrollProgressBar />
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
