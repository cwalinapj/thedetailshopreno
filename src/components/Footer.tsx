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

          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a
                href="https://www.instagram.com/supremexdetail/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://www.facebook.com/supremexdetailing/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}
