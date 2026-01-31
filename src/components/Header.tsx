'use client';

import {useState} from 'react';
import {useTranslations, useLocale} from 'next-intl';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import ClickToCall from './ClickToCall';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoImage = `/images/2024/09/CARDETAILINGRENOSPARKS`;

  const navItems = [
    {href: '/', label: t('home')},
    {href: '/services', label: t('services')},
    {href: '/portfolio', label: t('portfolio')},
    {href: '/testimonials', label: t('testimonials')},
    {href: '/about', label: t('about')},
    {href: '/contact', label: t('contact')},
  ];

  const localePath = (path: string) => {
    return locale === 'en' ? path : `/${locale}${path}`;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link href={localePath('/')} className="logo">
          <picture>
            <source
              srcSet={`${logoImage}-640w.webp`}
              type="image/webp"
            />
            <img
              src={`${logoImage}-640w.jpg`}
              alt="Car Detailing Reno Auto Detailing"
              className="logo-image"
              width="180"
              height="76"
            />
          </picture>
        </Link>

        {/* Desktop Navigation */}
        <nav className="main-nav desktop-nav">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={localePath(item.href)}
                  className={pathname === localePath(item.href) ? 'active' : ''}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <LanguageSwitcher />
          <ClickToCall variant="header" />
          <Link
            href="https://supremexautodetail.fieldd.co/"
            target="_blank"
            rel="noopener"
            className="btn btn-primary desktop-only"
            data-gtm-action="book_click"
            data-gtm-label="header"
          >
            {t('book')}
          </Link>

          {/* Mobile Hamburger */}
          <button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <nav className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-list">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={localePath(item.href)}
                className={pathname === localePath(item.href) ? 'active' : ''}
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="mobile-nav-cta">
            <Link
              href="https://supremexautodetail.fieldd.co/"
              target="_blank"
              rel="noopener"
              className="btn btn-primary btn-large"
              onClick={closeMobileMenu}
            >
              {t('book')}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="mobile-nav-overlay" onClick={closeMobileMenu} />
      )}
    </header>
  );
}
