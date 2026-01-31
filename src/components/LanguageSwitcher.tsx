'use client';

import {useLocale} from 'next-intl';
import {usePathname, useRouter} from 'next/navigation';
import {locales} from '@/i18n';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    // Remove current locale prefix if present
    let newPath = pathname;
    locales.forEach((loc) => {
      if (pathname.startsWith(`/${loc}/`)) {
        newPath = pathname.replace(`/${loc}`, '');
      } else if (pathname === `/${loc}`) {
        newPath = '/';
      }
    });

    // Add new locale prefix if not default
    if (newLocale !== 'en') {
      newPath = `/${newLocale}${newPath}`;
    }

    router.push(newPath);
  };

  return (
    <div className="language-switcher">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`lang-btn ${locale === loc ? 'active' : ''}`}
          aria-label={`Switch to ${loc === 'en' ? 'English' : 'Español'}`}
          aria-current={locale === loc ? 'true' : undefined}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
