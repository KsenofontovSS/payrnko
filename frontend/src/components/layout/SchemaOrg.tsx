export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'РНКО «Простые платежные решения» (ООО)',
    alternateName: 'RNCO Simple Payment Solutions',
    url: 'https://ppr-rnko.ru',
    description: 'Расчётная небанковская кредитная организация. Рег. номер ЦБ РФ: 3566.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Примерная, д. 1',
      addressLocality: 'Москва',
      addressCountry: 'RU',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+7-495-123-45-67',
      contactType: 'customer service',
      availableLanguage: ['Russian', 'English'],
    },
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
