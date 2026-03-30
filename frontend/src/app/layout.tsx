import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | РНКО «Простые платежные решения»',
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
  return children;
}
