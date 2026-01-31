'use client';

import {useTranslations} from 'next-intl';
import Link from 'next/link';
import {trackFielddBooking} from '@/lib/analytics';

export default function Hero() {
  const t = useTranslations('hero');

  const handleBookClick = () => {
    trackFielddBooking('hero_cta_click');
  };

  // Hero background image - pressure wash silhouette from Envato
  const heroImage = `/images/envato/pressure-wash-hero`;

  return (
    <section className="hero">
      <div className="hero-background">
        <picture>
          <source
            srcSet={`${heroImage}-1920w.avif 1920w, ${heroImage}-1440w.avif 1440w, ${heroImage}-960w.avif 960w, ${heroImage}-640w.avif 640w, ${heroImage}-360w.avif 360w`}
            type="image/avif"
            sizes="100vw"
          />
          <source
            srcSet={`${heroImage}-1920w.webp 1920w, ${heroImage}-1440w.webp 1440w, ${heroImage}-960w.webp 960w, ${heroImage}-640w.webp 640w, ${heroImage}-360w.webp 360w`}
            type="image/webp"
            sizes="100vw"
          />
          <img
            src={`${heroImage}-960w.jpg`}
            srcSet={`${heroImage}-1920w.jpg 1920w, ${heroImage}-1440w.jpg 1440w, ${heroImage}-960w.jpg 960w, ${heroImage}-640w.jpg 640w, ${heroImage}-360w.jpg 360w`}
            sizes="100vw"
            alt="Professional auto detailing in Reno, Nevada"
            className="hero-image"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
        <div className="hero-overlay" />
      </div>

      <div className="hero-container">
        <div className="hero-content">
          <p className="hero-preheading">{t('preheading')}</p>
          <h1 className="hero-title">{t('title')}</h1>
          <p className="hero-subtitle">{t('subtitle')}</p>
          <p className="hero-description">{t('description')}</p>

          <div className="hero-cta">
            <Link
              href="/contact"
              className="btn btn-white btn-large"
            >
              {t('contactBtn')}
            </Link>
          </div>
        </div>

        <div className="hero-form">
          <div className="booking-form-card">
            <h2 className="booking-form-title">{t('formTitle')}</h2>
            <form className="booking-form">
              <input type="text" placeholder={t('formName')} className="form-input" />
              <input type="email" placeholder={t('formEmail')} className="form-input" />
              <input type="tel" placeholder={t('formPhone')} className="form-input" />
              <textarea placeholder={t('formNotes')} className="form-textarea" rows={3}></textarea>
              <Link
                href="https://supremexautodetail.fieldd.co/"
                target="_blank"
                rel="noopener"
                className="btn btn-primary btn-block"
                onClick={handleBookClick}
                data-gtm-action="fieldd_booking"
                data-gtm-label="hero"
              >
                {t('formSubmit')}
              </Link>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
