import {useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import Link from 'next/link';
import {routing} from '../../../../i18n/routing';
import {generatePageMetadata} from '@/lib/seo';

type Locale = (typeof routing.locales)[number];

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return generatePageMetadata({locale, page: 'testimonials'});
}

// Extended testimonials data with service references for internal linking
const testimonials = [
  {id: 1, rating: 5, service: 'fullDetail'},
  {id: 2, rating: 5, service: 'ceramicCoating'},
  {id: 3, rating: 5, service: 'interior'},
  {id: 4, rating: 5, service: 'exterior'},
  {id: 5, rating: 5, service: 'ceramicCoating'},
  {id: 6, rating: 5, service: 'interior'},
];

export default async function TestimonialsPage({params}: {params: Promise<{locale: string}>}) {
  const {locale: requestedLocale} = await params;

  const locale: Locale = routing.locales.includes(requestedLocale as Locale)
    ? requestedLocale as Locale
    : routing.defaultLocale;

  setRequestLocale(locale);

  return <TestimonialsContent locale={locale} />;
}

function TestimonialsContent({locale}: {locale: Locale}) {
  const t = useTranslations('testimonialsPage');
  const tNav = useTranslations('nav');

  // Service links for internal linking
  const serviceLinks: Record<string, {href: string; label: string}> = {
    ceramicCoating: {
      href: `/${locale}/services/ceramic-coating`,
      label: t('serviceLinks.ceramicCoating'),
    },
    interior: {
      href: `/${locale}/services/interior`,
      label: t('serviceLinks.interior'),
    },
    exterior: {
      href: `/${locale}/services/exterior`,
      label: t('serviceLinks.exterior'),
    },
    fullDetail: {
      href: `/${locale}/services`,
      label: t('serviceLinks.fullDetail'),
    },
  };

  return (
    <>
      <section className="page-hero testimonials-hero">
        <div className="container">
          <h1>{t('title')}</h1>
          <p>{t('subtitle')}</p>
        </div>
      </section>

      <section className="testimonials-page">
        <div className="container">
          {/* Trust indicators */}
          <div className="trust-indicators">
            <div className="trust-item">
              <span className="trust-number">500+</span>
              <span className="trust-label">{t('happyCustomers')}</span>
            </div>
            <div className="trust-item">
              <span className="trust-number">5.0</span>
              <span className="trust-label">{t('googleRating')}</span>
            </div>
            <div className="trust-item">
              <span className="trust-number">10+</span>
              <span className="trust-label">{t('yearsExperience')}</span>
            </div>
          </div>

          {/* Main testimonials grid */}
          <div className="testimonials-full-grid">
            {testimonials.map((testimonial) => {
              const serviceLink = serviceLinks[testimonial.service];
              return (
                <div key={testimonial.id} className="testimonial-card-full">
                  <div className="testimonial-rating">
                    {Array.from({length: testimonial.rating}).map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>
                  <blockquote className="testimonial-quote">
                    "{t(`reviews.${testimonial.id}.quote`)}"
                  </blockquote>
                  <div className="testimonial-service">
                    <span>{t('serviceUsed')}: </span>
                    <Link href={serviceLink.href} className="service-link">
                      {serviceLink.label}
                    </Link>
                  </div>
                  <div className="testimonial-author">
                    <div className="author-info">
                      <span className="author-name">{t(`reviews.${testimonial.id}.name`)}</span>
                      <span className="author-location">{t(`reviews.${testimonial.id}.location`)}</span>
                    </div>
                    <span className="verified-badge">
                      <CheckIcon />
                      {t('verified')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SEO-rich content section with internal links */}
          <div className="testimonials-seo-content">
            <h2>{t('whyCustomersChoose')}</h2>
            <p>
              {t('seoContent.intro')}{' '}
              <Link href={`/${locale}/services/ceramic-coating`}>{t('serviceLinks.ceramicCoating')}</Link>
              {t('seoContent.ceramicMention')}{' '}
              <Link href={`/${locale}/services/interior`}>{t('serviceLinks.interior')}</Link>
              {t('seoContent.interiorMention')}{' '}
              <Link href={`/${locale}/services/exterior`}>{t('serviceLinks.exterior')}</Link>
              {t('seoContent.exteriorMention')}
            </p>
          </div>

          {/* Google Reviews CTA */}
          <div className="google-reviews-cta">
            <h3>{t('leaveReview')}</h3>
            <p>{t('leaveReviewSubtitle')}</p>
            <a
              href="https://www.google.com/search?q=car+detailing+reno"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              {t('writeReview')}
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>{t('ctaTitle')}</h2>
          <p>{t('ctaSubtitle')}</p>
          <div className="cta-buttons">
            <Link href={`/${locale}/contact`} className="btn btn-white">
              {t('contactUs')}
            </Link>
            <Link
              href="https://supremexautodetail.fieldd.co/"
              target="_blank"
              rel="noopener"
              className="btn btn-primary"
            >
              {tNav('book')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="#FFD700"
      stroke="#FFD700"
      strokeWidth="1"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
