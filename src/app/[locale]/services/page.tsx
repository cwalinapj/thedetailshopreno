import {setRequestLocale, getTranslations} from 'next-intl/server';
import {routing} from '../../../../i18n/routing';
import {generatePageMetadata} from '@/lib/seo';
import Link from 'next/link';
import { getPhone } from "@/lib/phone";

type Locale = (typeof routing.locales)[number];

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return generatePageMetadata({locale, page: 'services'});
}

const serviceKeys = ['interior', 'exterior', 'motorcycles', 'rvBoats'] as const;
const iconMap = {interior: 'interior', exterior: 'exterior', motorcycles: 'motorcycle', rvBoats: 'rv'};

export default async function ServicesPage({params}: {params: Promise<{locale: string}>}) {
  const {locale: requestedLocale} = await params;
  const locale: Locale = routing.locales.includes(requestedLocale as Locale) ? requestedLocale as Locale : routing.defaultLocale;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'servicesPage'});

  return (
    <section className="services-page">
      <div className="container">
        <header className="page-header">
          <h1>{t('title')}</h1>
          <p>{t('subtitle')}</p>
        </header>
        <div className="services-list">
          {serviceKeys.map((key) => (
            <div key={key} className="service-detail-card">
              <div className="service-header">
                <div className="service-icon-large"><ServiceIcon type={iconMap[key]} /></div>
                <div className="service-info">
                  <h2>{t(`serviceTypes.${key}.title`)}</h2>
                  <p>{t(`serviceTypes.${key}.description`)}</p>
                </div>
              </div>
              <div className="service-features">
                <h3>{t('whatsIncluded')}</h3>
                <ul>
                  {(t.raw(`serviceTypes.${key}.features`) as string[]).map((feature, index) => (
                    <li key={index}><CheckIcon />{feature}</li>
                  ))}
                </ul>
              </div>
              <Link href="https://supremexautodetail.fieldd.co/" target="_blank" rel="noopener" className="btn btn-primary">{t('bookService')}</Link>
            </div>
          ))}
        </div>
        <div className="services-cta">
          <h2>{t('ctaTitle')}</h2>
          <p>{t('ctaText')}</p>
          <div className="cta-buttons">
            <a href={`tel:`} className="btn btn-primary">{t('callNow')}</a>
            <Link href="https://supremexautodetail.fieldd.co/" target="_blank" rel="noopener" className="btn btn-white">{t('bookOnline')}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceIcon({type}: {type: string}) {
  const icons: Record<string, JSX.Element> = {
    interior: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor"><path d="M56 16H8c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h6v4h4v-4h28v4h4v-4h6c2.2 0 4-1.8 4-4V20c0-2.2-1.8-4-4-4zM20 40c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm24 0c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zM8 28v-8h48v8H8z"/></svg>),
    exterior: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor"><path d="M56 16H8c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h6v4h4v-4h28v4h4v-4h6c2.2 0 4-1.8 4-4V20c0-2.2-1.8-4-4-4zM20 40c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm24 0c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zM8 28v-8h48v8H8z"/><circle cx="50" cy="10" r="4"/><circle cx="42" cy="6" r="2"/><circle cx="54" cy="4" r="2"/></svg>),
    motorcycle: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor"><circle cx="14" cy="44" r="10" fill="none" stroke="currentColor" strokeWidth="4"/><circle cx="50" cy="44" r="10" fill="none" stroke="currentColor" strokeWidth="4"/><path d="M14 44h12l8-16h12l4 16h0" fill="none" stroke="currentColor" strokeWidth="4"/><circle cx="32" cy="20" r="4"/><path d="M28 20h-6l-4 8" fill="none" stroke="currentColor" strokeWidth="3"/></svg>),
    rv: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor"><rect x="8" y="20" width="40" height="20" rx="2"/><rect x="48" y="24" width="12" height="16" rx="1"/><circle cx="16" cy="44" r="6"/><circle cx="40" cy="44" r="6"/><rect x="12" y="24" width="8" height="8" fill="white" opacity="0.3"/><rect x="24" y="24" width="8" height="8" fill="white" opacity="0.3"/></svg>),
  };
  return icons[type] || icons.interior;
}

function CheckIcon() {
  return (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 4.5L6 12L2.5 8.5" stroke="#0094DA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
}
