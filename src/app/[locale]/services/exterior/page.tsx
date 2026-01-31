import {setRequestLocale, getTranslations} from 'next-intl/server';
import {routing} from '../../../../../i18n/routing';
import {generatePageMetadata} from '@/lib/seo';
import Link from 'next/link';
import Image from 'next/image';

type Locale = (typeof routing.locales)[number];

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return generatePageMetadata({locale, page: 'exteriorServices'});
}

const exteriorServices = [
  'handWash',
  'clayBar',
  'paintDecontamination',
  'polishWax',
  'wheelCleaning',
  'trimRestoration',
  'glassCoating',
  'paintProtection',
  'headlightRestoration',
  'engineBayDetail',
  'tireShine',
  'chromePlating',
] as const;

export default async function ExteriorServicesPage({params}: {params: Promise<{locale: string}>}) {
  const {locale: requestedLocale} = await params;
  const locale: Locale = routing.locales.includes(requestedLocale as Locale) ? requestedLocale as Locale : routing.defaultLocale;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'exteriorServicesPage'});

  return (
    <>
      {/* Hero Banner */}
      <section className="exterior-hero">
        <div className="exterior-hero-overlay"></div>
        <div className="container exterior-hero-content">
          <h1>{t('heroTitle')}</h1>
          <nav className="breadcrumb">
            <Link href={`/${locale}`}>{t('home')}</Link>
            <span className="separator">|</span>
            <span>{t('exteriorServices')}</span>
          </nav>
        </div>
      </section>

      {/* Intro Section */}
      <section className="exterior-intro">
        <div className="container">
          <div className="exterior-intro-grid">
            <div className="exterior-intro-image">
              <Image
                src="/images/exterior-detailing.jpg"
                alt={t('introImageAlt')}
                width={600}
                height={400}
                style={{objectFit: 'cover', borderRadius: '8px'}}
              />
            </div>
            <div className="exterior-intro-content">
              <span className="exterior-label">{t('exteriorDetailing')}</span>
              <h2>{t('introTitle')}</h2>
              <p>{t('introDescription')}</p>
              <ul className="exterior-benefits">
                <li>
                  <ShineIcon />
                  <span>{t('benefit1')}</span>
                </li>
                <li>
                  <ShineIcon />
                  <span>{t('benefit2')}</span>
                </li>
              </ul>
              <Link href="https://supremexautodetail.fieldd.co/" target="_blank" rel="noopener" className="btn btn-primary">
                {t('bookNow')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="exterior-services-grid-section">
        <div className="container">
          <div className="exterior-services-grid">
            {exteriorServices.map((key) => (
              <div key={key} className="exterior-service-item">
                <h3>{t(`services.${key}.title`)}</h3>
                <p>{t(`services.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="exterior-cta">
        <div className="container">
          <h2>{t('ctaTitle')}</h2>
          <p>{t('ctaText')}</p>
          <div className="cta-buttons">
            <a href="tel:+17754405342" className="btn btn-primary">{t('callNow')}</a>
            <Link href="https://supremexautodetail.fieldd.co/" target="_blank" rel="noopener" className="btn btn-white">{t('bookOnline')}</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function ShineIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor" width="24" height="24">
      <path d="M32 4l4 12h12l-10 8 4 12-10-8-10 8 4-12-10-8h12zM16 44l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6zM48 44l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z"/>
    </svg>
  );
}
