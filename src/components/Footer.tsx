'use client';

import {useTranslations, useLocale} from 'next-intl';
import Link from 'next/link';
import ClickToCall from './ClickToCall';

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();

  const localePath = (path: string) => {
    return locale === 'en' ? path : `/${locale}${path}`;
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>{t('company')}</h3>
            <p>{t('tagline')}</p>
            <p>{t('address')}</p>
            <p>{t('hours')}</p>
          </div>

          <div className="footer-nav">
            <h4>Navigation</h4>
            <ul>
              <li><Link href={localePath('/')}>{tNav('home')}</Link></li>
              <li><Link href={localePath('/services')}>{tNav('services')}</Link></li>
              <li><Link href={localePath('/portfolio')}>{tNav('portfolio')}</Link></li>
              <li><Link href={localePath('/about')}>{tNav('about')}</Link></li>
              <li><Link href={localePath('/contact')}>{tNav('contact')}</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact</h4>
            <ClickToCall variant="footer" />
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

        <div className="footer-bottom">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}

