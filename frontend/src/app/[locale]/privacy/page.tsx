import { createTranslator } from '@/lib/i18n';
import { Container, Section, Typography, Breadcrumbs } from '@/components/ui';

export default function PrivacyPage() {
  const t = createTranslator('ru', 'privacy');
  const tNav = createTranslator('ru', 'common.nav');

  const breadcrumbs = [
    { label: tNav('home'), href: '/' },
    { label: t('title') },
  ];

  return (
    <Section background="snow">
      <Container className="max-w-4xl">
        <Breadcrumbs items={breadcrumbs} className="mb-6" />
        <Typography variant="h1" className="mb-8">{t('title')}</Typography>

        <div className="prose max-w-none space-y-6">
          <Typography variant="h2">1. Общие положения</Typography>
          <Typography variant="body" color="secondary">
            Настоящая Политика конфиденциальности определяет порядок обработки и защиты РНКО «Простые платежные решения» (ООО) (далее — Организация) персональных данных пользователей сайта ppr-rnko.ru.
          </Typography>

          <Typography variant="h2">2. Сбор информации</Typography>
          <Typography variant="body" color="secondary">
            Организация собирает персональные данные, которые пользователь предоставляет добровольно при заполнении форм на сайте: имя, адрес электронной почты, номер телефона, текст обращения.
          </Typography>

          <Typography variant="h2">3. Использование информации</Typography>
          <Typography variant="body" color="secondary">
            Собранная информация используется для обработки обращений, улучшения качества обслуживания и выполнения требований законодательства Российской Федерации.
          </Typography>

          <Typography variant="h2">4. Защита данных</Typography>
          <Typography variant="body" color="secondary">
            Организация принимает необходимые организационные и технические меры для защиты персональных данных от неправомерного доступа, уничтожения, изменения, блокирования, копирования и распространения.
          </Typography>

          <Typography variant="h2">5. Cookie-файлы</Typography>
          <Typography variant="body" color="secondary">
            Сайт использует cookie-файлы для обеспечения корректной работы, сбора статистики посещений и улучшения пользовательского опыта. Пользователь может отключить cookie в настройках браузера.
          </Typography>

          <Typography variant="h2">6. Контакты</Typography>
          <Typography variant="body" color="secondary">
            По вопросам обработки персональных данных обращайтесь: info@ppr-rnko.ru
          </Typography>
        </div>
      </Container>
    </Section>
  );
}
