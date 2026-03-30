import { createTranslator } from '@/lib/i18n';
import { Info, Shield, FileText, Users, ExternalLink } from 'lucide-react';
import { Container, Section, Typography, Breadcrumbs, Accordion } from '@/components/ui';

export default function CompliancePage() {
  const t = createTranslator('ru', 'compliance');
  const tNav = createTranslator('ru', 'common.nav');

  const breadcrumbs = [
    { label: tNav('home'), href: '/' },
    { label: t('title') },
  ];

  const accordionItems = [
    {
      id: 'aml',
      title: 'Политика ПОД/ФТ',
      content: (
        <div className="space-y-4">
          <p>РНКО «Простые платежные решения» осуществляет внутренний контроль в целях противодействия легализации (отмыванию) доходов, полученных преступным путём, финансированию терроризма и финансированию распространения оружия массового уничтожения.</p>
          <p>Организация руководствуется Федеральным законом от 07.08.2001 № 115-ФЗ «О противодействии легализации (отмыванию) доходов, полученных преступным путём, и финансированию терроризма» и нормативными актами Банка России.</p>
        </div>
      ),
    },
    {
      id: 'kyc',
      title: 'Процедуры идентификации клиентов (KYC)',
      content: (
        <div className="space-y-4">
          <p>При установлении деловых отношений проводится идентификация клиента, представителя клиента и выгодоприобретателя.</p>
          <p className="font-medium">Необходимые документы для юридических лиц:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Учредительные документы</li>
            <li>Свидетельство о государственной регистрации</li>
            <li>Свидетельство о постановке на учёт в налоговом органе</li>
            <li>Документы, подтверждающие полномочия руководителя</li>
            <li>Лицензии (при наличии лицензируемой деятельности)</li>
            <li>Сведения о бенефициарных владельцах</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'officer',
      title: 'Ответственный сотрудник',
      content: (
        <div className="space-y-2">
          <p>По вопросам комплаенса и ПОД/ФТ обращайтесь:</p>
          <p>Email: <a href="mailto:compliance@ppr-rnko.ru" className="text-royal hover:underline">compliance@ppr-rnko.ru</a></p>
          <p>Телефон: <a href="tel:+74951234568" className="text-royal hover:underline">+7 (495) 123-45-68</a></p>
        </div>
      ),
    },
    {
      id: 'regulations',
      title: 'Нормативные акты',
      content: (
        <div className="space-y-2">
          <ul className="space-y-2">
            <li>
              <a href="https://www.consultant.ru/document/cons_doc_LAW_32834/" target="_blank" rel="noopener noreferrer" className="text-royal hover:underline inline-flex items-center gap-1">
                Федеральный закон № 115-ФЗ <ExternalLink size={14} aria-hidden="true" />
              </a>
            </li>
            <li>
              <a href="https://cbr.ru" target="_blank" rel="noopener noreferrer" className="text-royal hover:underline inline-flex items-center gap-1">
                Нормативные акты Банка России <ExternalLink size={14} aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <Section background="snow">
      <Container>
        <Breadcrumbs items={breadcrumbs} className="mb-6" />
        <Typography variant="h1" className="mb-4">{t('title')}</Typography>
        <Typography variant="bodyLarge" color="secondary" className="mb-8 max-w-3xl">
          {t('description')}
        </Typography>

        {/* Информационный баннер */}
        <div className="flex items-start gap-3 bg-ice border border-sky-accent/30 rounded-card p-4 mb-8">
          <Shield size={24} className="text-royal flex-shrink-0 mt-0.5" strokeWidth={1.5} aria-hidden="true" />
          <Typography variant="bodySmall" color="secondary">
            Деятельность осуществляется в соответствии с Федеральным законом от 07.08.2001 № 115-ФЗ «О противодействии легализации (отмыванию) доходов, полученных преступным путём, и финансированию терроризма».
          </Typography>
        </div>

        {/* Аккордеон */}
        <div className="bg-white rounded-card border border-silver p-6">
          <Accordion items={accordionItems} />
        </div>
      </Container>
    </Section>
  );
}
