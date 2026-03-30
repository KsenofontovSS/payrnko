import type { Metadata } from 'next';
import './globals.css';
import { Header, Footer, ScrollProgressBar } from '@/components/layout';
import { OrganizationSchema } from '@/components/layout/SchemaOrg';
import { CookieBanner } from '@/components/forms/CookieBanner';

export const metadata: Metadata = {
  title: {
    template: '%s | РНКО ППР',
    default: 'РНКО «Простые платежные решения»',
  },
  description:
    'Расчётная небанковская кредитная организация. Рег. номер ЦБ РФ: 3566.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
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
