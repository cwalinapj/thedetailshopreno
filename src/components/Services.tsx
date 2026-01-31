'use client';

import {useTranslations, useLocale} from 'next-intl';
import Link from 'next/link';

const serviceKeys = [
  'interiorDetailing',
  'exteriorDetailing',
  'motorcyclesCleaning',
  'rvsBoats',
] as const;

const serviceLinks: Record<string, string> = {
  interiorDetailing: '/services/interior',
  exteriorDetailing: '/services',
  motorcyclesCleaning: '/services',
  rvsBoats: '/services',
};

export default function Services() {
  const t = useTranslations('services');
  const locale = useLocale();

  return (
    <section className="services" id="services">
      <div className="container">
        <h2 className="section-title">{t('title')}</h2>

        <div className="services-grid">
          {serviceKeys.map((key) => (
            <div key={key} className="service-card">
              <div className="service-icon">
                <ServiceIcon type={key} />
              </div>
              <h3 className="service-title">{t(`${key}.title`)}</h3>
              <p className="service-description">{t(`${key}.description`)}</p>
              <Link href={`/${locale}${serviceLinks[key]}`} className="service-link">
                {t(`${key}.readMore`)}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceIcon({type}: {type: string}) {
  const icons: Record<string, JSX.Element> = {
    interiorDetailing: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
        <path d="M56 16H8c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h6v4h4v-4h28v4h4v-4h6c2.2 0 4-1.8 4-4V20c0-2.2-1.8-4-4-4zM20 40c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm24 0c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zM8 28v-8h48v8H8z"/>
      </svg>
    ),
    exteriorDetailing: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
        <path d="M56 16H8c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h6v4h4v-4h28v4h4v-4h6c2.2 0 4-1.8 4-4V20c0-2.2-1.8-4-4-4zM20 40c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm24 0c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zM8 28v-8h48v8H8z"/>
        <circle cx="50" cy="10" r="4"/>
        <circle cx="42" cy="6" r="2"/>
        <circle cx="54" cy="4" r="2"/>
      </svg>
    ),
    motorcyclesCleaning: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
        <circle cx="14" cy="44" r="10" fill="none" stroke="currentColor" strokeWidth="4"/>
        <circle cx="50" cy="44" r="10" fill="none" stroke="currentColor" strokeWidth="4"/>
        <path d="M14 44h12l8-16h12l4 16h0" fill="none" stroke="currentColor" strokeWidth="4"/>
        <circle cx="32" cy="20" r="4"/>
        <path d="M28 20h-6l-4 8" fill="none" stroke="currentColor" strokeWidth="3"/>
      </svg>
    ),
    rvsBoats: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
        <rect x="8" y="20" width="40" height="20" rx="2"/>
        <rect x="48" y="24" width="12" height="16" rx="1"/>
        <circle cx="16" cy="44" r="6"/>
        <circle cx="40" cy="44" r="6"/>
        <rect x="12" y="24" width="8" height="8" fill="white" opacity="0.3"/>
        <rect x="24" y="24" width="8" height="8" fill="white" opacity="0.3"/>
      </svg>
    ),
  };

  return icons[type] || icons.interiorDetailing;
}
