'use client';

import {useState} from 'react';
import {useTranslations, useLocale} from 'next-intl';
import Link from 'next/link';

const FORM_WORKER_URL = process.env.NEXT_PUBLIC_FORM_WORKER_URL || '';

export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch(FORM_WORKER_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          ...formData,
          source: 'hero-form',
          locale,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({name: '', email: '', phone: '', notes: ''});
        // Reset after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
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

            {status === 'success' ? (
              <div className="form-success">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <p>Thank you! We&apos;ll be in touch shortly.</p>
              </div>
            ) : (
              <form className="booking-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder={t('formName')}
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder={t('formEmail')}
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder={t('formPhone')}
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <textarea
                  name="notes"
                  placeholder={t('formNotes')}
                  className="form-textarea"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={status === 'loading'}
                  data-gtm-action="form_submit"
                  data-gtm-label="hero"
                >
                  {status === 'loading' ? 'Submitting...' : t('formSubmit')}
                </button>
                {status === 'error' && (
                  <p className="form-error">Something went wrong. Please try again or call us directly.</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
