'use client';

import {useTranslations} from 'next-intl';
import Link from 'next/link';
import ClickToCall from './ClickToCall';
import {trackFielddBooking} from '@/lib/analytics';

export default function CTASection() {
  const t = useTranslations('cta');

  const handleBookClick = () => {
    trackFielddBooking('cta_section_click');
  };

  return (
    <section className="cta-section">
      <div className="container">
        <h2>Ready to Transform Your Vehicle?</h2>
        <p>Book your professional detailing appointment today</p>

        <div className="cta-buttons">
          <Link
            href="https://supremexautodetail.fieldd.co/"
            target="_blank"
            rel="noopener"
            className="btn btn-primary btn-large"
            onClick={handleBookClick}
            data-gtm-action="fieldd_booking"
            data-gtm-label="cta_section"
          >
            {t('bookOnline')}
          </Link>
          <ClickToCall variant="hero" />
        </div>
      </div>
    </section>
  );
}
