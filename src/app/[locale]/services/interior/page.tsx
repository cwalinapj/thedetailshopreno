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
  return generatePageMetadata({locale, page: 'interiorServices'});
}

const interiorServices = [
  'fullWipeDown',
  'vacuumInterior',
  'spotStainTreatment',
  'cleanProtectPlastic',
  'cleanDoorJambs',
  'cleanWindowsMirrors',
  'detailFloorMats',
  'leatherConditioning',
  'airFreshener',
  'detailTrunk',
  'shampooCarpets',
  'shampooSeats',
] as const;

export default async function InteriorServicesPage({params}: {params: Promise<{locale: string}>}) {
  const {locale: requestedLocale} = await params;
  const locale: Locale = routing.locales.includes(requestedLocale as Locale) ? requestedLocale as Locale : routing.defaultLocale;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'interiorServicesPage'});

  return (
    <>
      {/* Hero Banner */}
      <section className="interior-hero">
        <div className="interior-hero-overlay"></div>
        <div className="container interior-hero-content">
          <h1>{t('heroTitle')}</h1>
          <nav className="breadcrumb">
            <Link href={`/${locale}`}>{t('home')}</Link>
            <span className="separator">|</span>
            <span>{t('interiorServices')}</span>
          </nav>
        </div>
      </section>

      {/* Intro Section */}
      <section className="interior-intro">
        <div className="container">
          <div className="interior-intro-grid">
            <div className="interior-intro-image">
              <Image
                src="/images/interior-detailing.jpg"
                alt={t('introImageAlt')}
                width={600}
                height={400}
                style={{objectFit: 'cover', borderRadius: '8px'}}
              />
            </div>
            <div className="interior-intro-content">
              <span className="interior-label">{t('interiorDetailing')}</span>
              <h2>{t('introTitle')}</h2>
              <p>{t('introDescription')}</p>
              <ul className="interior-benefits">
                <li>
                  <CarIcon />
                  <span>{t('benefit1')}</span>
                </li>
                <li>
                  <CarIcon />
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
      <section className="interior-services-grid-section">
        <div className="container">
          <div className="interior-services-grid">
            {interiorServices.map((key) => (
              <div key={key} className="interior-service-item">
                <h3>{t(`services.${key}.title`)}</h3>
                <p>{t(`services.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="interior-cta">
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

function CarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor" width="24" height="24">
      <path d="M56 16H8c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h6v4h4v-4h28v4h4v-4h6c2.2 0 4-1.8 4-4V20c0-2.2-1.8-4-4-4zM20 40c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm24 0c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zM8 28v-8h48v8H8z"/>
    </svg>
  );
}
