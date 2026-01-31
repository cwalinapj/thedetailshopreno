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
  return generatePageMetadata({locale, page: 'about'});
}

export default async function AboutPage({params}: {params: Promise<{locale: string}>}) {
  const {locale: requestedLocale} = await params;
  const locale: Locale = routing.locales.includes(requestedLocale as Locale) ? requestedLocale as Locale : routing.defaultLocale;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'about'});
  const phone = getPhone(locale);

  return (
    <section className="about-page">
      <div className="container">
        <header className="page-header">
          <h1>{t('title')}</h1>
          <p>{t('subtitle')}</p>
        </header>
        <div className="about-content">
          <div className="about-section">
            <h2>{t('storyTitle')}</h2>
            <p>{t('storyP1')}</p>
            <p>{t('storyP2')}</p>
          </div>
          <div className="about-section">
            <h2>{t('whyChooseUs')}</h2>
            <div className="values-grid">
              <div className="value-card"><div className="value-icon"><QualityIcon /></div><h3>{t('values.quality.title')}</h3><p>{t('values.quality.description')}</p></div>
              <div className="value-card"><div className="value-icon"><ConvenienceIcon /></div><h3>{t('values.mobile.title')}</h3><p>{t('values.mobile.description')}</p></div>
              <div className="value-card"><div className="value-icon"><ExperienceIcon /></div><h3>{t('values.experience.title')}</h3><p>{t('values.experience.description')}</p></div>
              <div className="value-card"><div className="value-icon"><SatisfactionIcon /></div><h3>{t('values.satisfaction.title')}</h3><p>{t('values.satisfaction.description')}</p></div>
            </div>
          </div>
          <div className="about-section">
            <h2>{t('serviceAreaTitle')}</h2>
            <p>{t('serviceAreaText')}</p>
          </div>
          <div className="about-section">
            <h2>{t('partnerTitle')}</h2>
            <p>{t('partnerText')}</p>
          </div>
        </div>
        <div className="page-cta">
          <h2>{t('ctaTitle')}</h2>
          <p>{t('ctaText')}</p>
          <div className="cta-buttons">
            <a href={`tel:${phone.tel}`} className="btn btn-primary">{t('callNow')}</a>
            <Link href="https://supremexautodetail.fieldd.co/" target="_blank" rel="noopener" className="btn btn-white">{t('bookOnline')}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function QualityIcon() {
  return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
}

function ConvenienceIcon() {
  return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);
}

function ExperienceIcon() {
  return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
}

function SatisfactionIcon() {
  return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);
}
