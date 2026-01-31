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
  return generatePageMetadata({locale, page: 'faq'});
}

const faqCategories = ['general', 'services', 'pricing', 'booking'] as const;
const faqCounts = {general: 4, services: 4, pricing: 3, booking: 3} as const;

export default async function FAQPage({params}: {params: Promise<{locale: string}>}) {
  const {locale: requestedLocale} = await params;
  const locale: Locale = routing.locales.includes(requestedLocale as Locale) ? requestedLocale as Locale : routing.defaultLocale;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'faqPage'});

  return (
    <section className="faq-page">
      <div className="container">
        <header className="page-header">
          <h1>{t('title')}</h1>
          <p>{t('subtitle')}</p>
        </header>

        <div className="faq-content">
          {faqCategories.map((category) => (
            <div key={category} className="faq-category">
              <h2>{t(`categories.${category}.title`)}</h2>
              <div className="faq-list">
                {Array.from({length: faqCounts[category]}, (_, i) => i + 1).map((num) => (
                  <details key={num} className="faq-item">
                    <summary>
                      <span className="faq-question">{t(`categories.${category}.q${num}`)}</span>
                      <ChevronIcon />
                    </summary>
                    <div className="faq-answer">
                      <p>{t(`categories.${category}.a${num}`)}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="faq-cta">
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

function ChevronIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" className="faq-chevron">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}
