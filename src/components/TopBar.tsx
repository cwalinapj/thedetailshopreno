'use client';

import {useTranslations} from 'next-intl';
import ClickToCall from './ClickToCall';

export default function TopBar() {
  const t = useTranslations('topBar');

  return (
    <div className="top-bar">
      <div className="top-bar-container">
        <ClickToCall variant="topbar" />
        <div className="promo-marquee">
          <span className="promo-text">
            {t('deal')}
            <span className="promo-cta">Book Now</span>
          </span>
        </div>
      </div>
    </div>
  );
}
