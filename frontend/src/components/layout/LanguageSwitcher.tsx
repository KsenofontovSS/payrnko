'use client';

import { usePathname, useRouter } from 'next/navigation';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const segments = pathname.split('/');
  const locale = segments[1] === 'en' ? 'en' : 'ru';

  const switchLocale = (newLocale: string) => {
    const newSegments = [...segments];
    newSegments[1] = newLocale;
    router.push(newSegments.join('/'));
  };

  return (
    <div className="flex items-center gap-1 text-sm" role="group" aria-label="Выбор языка">
      <button
        type="button"
        onClick={() => switchLocale('ru')}
        className={`px-2 py-1 rounded transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal ${
          locale === 'ru' ? 'font-bold text-royal' : 'text-cool-gray hover:text-charcoal'
        }`}
        aria-current={locale === 'ru' ? 'true' : undefined}
      >
        RU
      </button>
      <span className="text-silver" aria-hidden="true">/</span>
      <button
        type="button"
        onClick={() => switchLocale('en')}
        className={`px-2 py-1 rounded transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal ${
          locale === 'en' ? 'font-bold text-royal' : 'text-cool-gray hover:text-charcoal'
        }`}
        aria-current={locale === 'en' ? 'true' : undefined}
      >
        EN
      </button>
    </div>
  );
}
