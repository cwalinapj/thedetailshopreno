'use client';

import {useEffect, useRef} from 'react';
import {trackHubSpotFormSubmission} from '@/lib/analytics';

interface HubSpotFormProps {
  portalId: string;
  formId: string;
  region?: string;
  className?: string;
}

declare global {
  interface Window {
    hbspt: any;
  }
}

export default function HubSpotForm({
  portalId,
  formId,
  region = 'na1',
  className = '',
}: HubSpotFormProps) {
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load HubSpot forms script
    const script = document.createElement('script');
    script.src = '//js.hsforms.net/forms/embed/v2.js';
    script.async = true;
    script.onload = () => {
      if (window.hbspt && formRef.current) {
        window.hbspt.forms.create({
          region,
          portalId,
          formId,
          target: formRef.current,
          onFormSubmit: () => {
            // Track form submission in GTM/GA4
            trackHubSpotFormSubmission(formId);
          },
          onFormSubmitted: () => {
            // Additional tracking after successful submission
            if (typeof window !== 'undefined' && window.dataLayer) {
              window.dataLayer.push({
                event: 'hubspot_form_submitted',
                event_category: 'conversion',
                event_action: 'lead_captured',
                form_id: formId,
              });
            }
          },
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [portalId, formId, region]);

  return <div ref={formRef} className={`hubspot-form ${className}`} />;
}
