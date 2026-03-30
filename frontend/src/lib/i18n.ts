import ruMessages from '@/i18n/messages/ru.json';
import enMessages from '@/i18n/messages/en.json';

type Messages = typeof ruMessages;

const messagesMap: Record<string, Messages> = { ru: ruMessages, en: enMessages };

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === 'string' ? current : path;
}

export function createTranslator(locale: string, namespace?: string) {
  const messages = messagesMap[locale] ?? ruMessages;

  return (key: string, params?: Record<string, string | number>) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    let value = getNestedValue(messages as unknown as Record<string, unknown>, fullKey);

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replace(`{${k}}`, String(v));
      });
    }

    return value;
  };
}
