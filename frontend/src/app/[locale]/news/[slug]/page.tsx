import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Container, Section, Typography, Breadcrumbs, Badge, Button } from '@/components/ui';
import { formatDate } from '@/lib/utils';

const mockArticles = [
  { slug: 'tariff-update-2026', title: 'Обновление тарифов на расчётные услуги', content: 'С 1 апреля 2026 года вступают в силу обновлённые тарифы на расчётно-кассовое обслуживание юридических лиц. Изменения затрагивают стоимость проведения платёжных поручений и кассового обслуживания.\n\nНовые тарифы разработаны с учётом текущей рыночной ситуации и направлены на оптимизацию расходов наших клиентов. Подробная информация доступна в разделе «Тарифы».', published_date: '2026-03-25', category: 'Обновления тарифов' },
  { slug: 'cbr-regulation-update', title: 'Изменения в нормативных актах ЦБ РФ', content: 'Банк России опубликовал изменения в Положение № 851-П, касающиеся расчётных небанковских кредитных организаций.\n\nОсновные изменения затрагивают порядок формирования обязательных резервов и требования к капиталу расчётных НКО.', published_date: '2026-03-20', category: 'Регуляторные изменения' },
  { slug: 'audit-2025', title: 'РНКО ППР прошла аудиторскую проверку', content: 'Компания успешно прошла ежегодную аудиторскую проверку за 2025 финансовый год. Аудитор подтвердил достоверность финансовой отчётности и соблюдение всех нормативных требований Банка России.\n\nАудиторское заключение размещено в разделе «Раскрытие информации».', published_date: '2026-03-15', category: 'События компании' },
  { slug: 'new-service-launch', title: 'Запуск нового сервиса быстрых переводов', content: 'РНКО ППР запускает новый сервис мгновенных переводов для юридических лиц через Систему быстрых платежей (СБП).', published_date: '2026-03-10', category: 'События компании' },
  { slug: 'cbr-meeting-2026', title: 'Участие в конференции Банка России', content: 'Представители РНКО ППР приняли участие в ежегодной конференции Банка России по платёжным системам.', published_date: '2026-03-05', category: 'События компании' },
  { slug: 'security-update', title: 'Обновление системы информационной безопасности', content: 'Завершена модернизация системы защиты информации в соответствии с требованиями ГОСТ Р 57580.', published_date: '2026-02-28', category: 'События компании' },
];

export default function NewsDetailPage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const article = mockArticles.find((a) => a.slug === params.slug);
  if (!article) notFound();

  const t = useTranslations('news');
  const tNav = useTranslations('common.nav');

  const breadcrumbs = [
    { label: tNav('home'), href: '/' },
    { label: t('title'), href: '/news' },
    { label: article.title },
  ];

  const currentIndex = mockArticles.findIndex((a) => a.slug === params.slug);
  const prevArticle = currentIndex > 0 ? mockArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < mockArticles.length - 1 ? mockArticles[currentIndex + 1] : null;

  return (
    <Section background="snow">
      <Container className="max-w-4xl">
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        <article>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-cool-gray">
              {formatDate(article.published_date, 'ru')}
            </span>
            <Badge variant="info">{article.category}</Badge>
          </div>

          <Typography variant="h1" className="mb-8">
            {article.title}
          </Typography>

          <div className="prose max-w-none">
            {article.content.split('\n\n').map((paragraph, i) => (
              <Typography key={i} variant="bodyLarge" color="secondary" className="mb-4">
                {paragraph}
              </Typography>
            ))}
          </div>
        </article>

        {/* Навигация prev/next */}
        <div className="mt-12 pt-8 border-t border-silver flex items-center justify-between">
          {prevArticle ? (
            <Button variant="ghost" href={`/news/${prevArticle.slug}`}>
              ← {prevArticle.title.slice(0, 30)}...
            </Button>
          ) : <div />}
          {nextArticle ? (
            <Button variant="ghost" href={`/news/${nextArticle.slug}`}>
              {nextArticle.title.slice(0, 30)}... →
            </Button>
          ) : <div />}
        </div>

        <div className="mt-8 text-center">
          <Button variant="secondary" href="/news">
            {t('backToNews')}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
