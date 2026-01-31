'use client';

import {useTranslations} from 'next-intl';
import {trackEvent} from '@/lib/analytics';

interface ClickToCallProps {
  variant?: 'header' | 'hero' | 'footer' | 'mobile-sticky' | 'topbar';
  className?: string;
}

const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER || '+17754405342';
const PHONE_DISPLAY = '(775) 440-5342';

export default function ClickToCall({variant = 'header', className = ''}: ClickToCallProps) {
  const t = useTranslations('cta');

  const handleClick = () => {
    // Track click-to-call event in GTM/GA4
    trackEvent({
      event: 'click_to_call',
      event_category: 'engagement',
      event_action: 'phone_click',
      event_label: variant,
      phone_number: PHONE_NUMBER,
      click_location: variant,
    });
  };

  if (variant === 'mobile-sticky') {
    return (
      <a
        href={`tel:${PHONE_NUMBER}`}
        onClick={handleClick}
        className={`click-to-call mobile-sticky ${className}`}
        aria-label={`${t('callUs')}: ${PHONE_DISPLAY}`}
        data-gtm-action="click_to_call"
        data-gtm-label="mobile_sticky"
      >
        <PhoneIcon />
        <span>{t('callUs')}</span>
      </a>
    );
  }

  if (variant === 'hero') {
    return (
      <a
        href={`tel:${PHONE_NUMBER}`}
        onClick={handleClick}
        className={`click-to-call btn btn-secondary ${className}`}
        aria-label={`${t('callUs')}: ${PHONE_DISPLAY}`}
        data-gtm-action="click_to_call"
        data-gtm-label="hero"
      >
        <PhoneIcon />
        <span>{PHONE_DISPLAY}</span>
      </a>
    );
  }

  return (
    <a
      href={`tel:${PHONE_NUMBER}`}
      onClick={handleClick}
      className={`click-to-call ${variant} ${className}`}
      aria-label={`${t('callUs')}: ${PHONE_DISPLAY}`}
      data-gtm-action="click_to_call"
      data-gtm-label={variant}
    >
      <PhoneIcon />
      <span className="phone-number">{PHONE_DISPLAY}</span>
    </a>
  );
}

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

// Mobile sticky call button (shows on mobile only)
export function MobileStickyCall() {
  return (
    <div className="mobile-sticky-container">
      <ClickToCall variant="mobile-sticky" />
    </div>
  );
}
