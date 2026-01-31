import {setRequestLocale, getTranslations} from 'next-intl/server';
import {routing} from '../../../../../i18n/routing';
import {generatePageMetadata} from '@/lib/seo';
import Link from 'next/link';
import Image from 'next/image';
import { getPhone } from "@/lib/phone";

type Locale = (typeof routing.locales)[number];

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return generatePageMetadata({locale, page: 'ceramicCoatingServices'});
}

const ceramicBenefits = [
  'hydrophobic',
  'uvProtection',
  'scratchResistance',
  'chemicalResistance',
  'easyMaintenance',
  'glossEnhancement',
] as const;

const ceramicPackages = ['bronze', 'silver', 'gold'] as const;

export default async function CeramicCoatingServicesPage({params}: {params: Promise<{locale: string}>}) {
  const {locale: requestedLocale} = await params;
  const locale: Locale = routing.locales.includes(requestedLocale as Locale) ? requestedLocale as Locale : routing.defaultLocale;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'ceramicCoatingServicesPage'});

  return (
    <>
      {/* Hero Banner */}
      <section className="ceramic-hero">
        <div className="ceramic-hero-overlay"></div>
        <div className="container ceramic-hero-content">
          <h1>{t('heroTitle')}</h1>
          <nav className="breadcrumb">
            <Link href={`/${locale}`}>{t('home')}</Link>
            <span className="separator">|</span>
            <span>{t('ceramicCoating')}</span>
          </nav>
        </div>
      </section>

      {/* Intro Section */}
      <section className="ceramic-intro">
        <div className="container">
          <div className="ceramic-intro-grid">
            <div className="ceramic-intro-image">
              <Image
                src="/images/ceramic-coating.jpg"
                alt={t('introImageAlt')}
                width={600}
                height={400}
                style={{objectFit: 'cover', borderRadius: '8px'}}
              />
            </div>
            <div className="ceramic-intro-content">
              <span className="ceramic-label">{t('ceramicCoating')}</span>
              <h2>{t('introTitle')}</h2>
              <p>{t('introDescription')}</p>
              <Link href="https://supremexautodetail.fieldd.co/" target="_blank" rel="noopener" className="btn btn-primary">
                {t('bookNow')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="ceramic-benefits-section">
        <div className="container">
          <h2>{t('benefitsTitle')}</h2>
          <div className="ceramic-benefits-grid">
            {ceramicBenefits.map((key) => (
              <div key={key} className="ceramic-benefit-item">
                <div className="benefit-icon"><ShieldIcon /></div>
                <h3>{t(`benefits.${key}.title`)}</h3>
                <p>{t(`benefits.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="ceramic-packages-section">
        <div className="container">
          <h2>{t('packagesTitle')}</h2>
          <div className="ceramic-packages-grid">
            {ceramicPackages.map((pkg) => (
              <div key={pkg} className={`ceramic-package-card ${pkg}`}>
                <h3>{t(`packages.${pkg}.name`)}</h3>
                <div className="package-price">{t(`packages.${pkg}.price`)}</div>
                <div className="package-warranty">{t(`packages.${pkg}.warranty`)}</div>
                <ul className="package-features">
                  {(t.raw(`packages.${pkg}.features`) as string[]).map((feature, index) => (
                    <li key={index}><CheckIcon />{feature}</li>
                  ))}
                </ul>
                <Link href="https://supremexautodetail.fieldd.co/" target="_blank" rel="noopener" className="btn btn-primary">
                  {t('bookNow')}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="ceramic-cta">
        <div className="container">
          <h2>{t('ctaTitle')}</h2>
          <p>{t('ctaText')}</p>
          <div className="cta-buttons">
            <a href={`tel:`} className="btn btn-primary">{t('callNow')}</a>
            <Link href="https://supremexautodetail.fieldd.co/" target="_blank" rel="noopener" className="btn btn-white">{t('bookOnline')}</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.5 4.5L6 12L2.5 8.5" stroke="#0094DA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
