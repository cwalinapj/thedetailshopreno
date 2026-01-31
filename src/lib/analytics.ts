declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

interface TrackEventParams {
  event: string;
  event_category?: string;
  event_action?: string;
  event_label?: string;
  [key: string]: any;
}

/**
 * Push event to GTM dataLayer
 */
export function trackEvent(params: TrackEventParams): void {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(params);
  }
}

/**
 * Track page view
 */
export function trackPageView(url: string, title: string): void {
  trackEvent({
    event: 'page_view',
    page_location: url,
    page_title: title,
  });
}

/**
 * Track form submission
 */
export function trackFormSubmission(formId: string, formName: string): void {
  trackEvent({
    event: 'form_submission',
    event_category: 'lead',
    event_action: 'submit',
    event_label: formName,
    form_id: formId,
  });
}

/**
 * Track HubSpot form submission
 */
export function trackHubSpotFormSubmission(formId: string): void {
  trackEvent({
    event: 'hubspot_form_submit',
    event_category: 'lead',
    event_action: 'hubspot_submit',
    event_label: formId,
    conversion_type: 'lead',
  });
}

/**
 * Track click-to-call
 */
export function trackClickToCall(location: string, phoneNumber: string): void {
  trackEvent({
    event: 'click_to_call',
    event_category: 'engagement',
    event_action: 'phone_click',
    event_label: location,
    phone_number: phoneNumber,
  });
}

/**
 * Track outbound link to Fieldd booking
 */
export function trackFielddBooking(action: string): void {
  trackEvent({
    event: 'fieldd_booking',
    event_category: 'conversion',
    event_action: action,
    event_label: 'fieldd_redirect',
    outbound: true,
    link_url: 'https://supremexautodetail.fieldd.co/',
  });
}

/**
 * Track service interest
 */
export function trackServiceInterest(serviceName: string): void {
  trackEvent({
    event: 'service_interest',
    event_category: 'engagement',
    event_action: 'view_service',
    event_label: serviceName,
  });
}

/**
 * Initialize cross-domain tracking for Fieldd
 */
export function initCrossDomainTracking(): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA4_ID, {
      linker: {
        domains: ['thedetailshopreno.com', 'supremexautodetail.fieldd.co'],
      },
    });
  }
}
