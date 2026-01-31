import {Metadata} from 'next';
import {locales, defaultLocale} from '@/i18n';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thedetailshopreno.com';

interface PageMetadataParams {
  locale: string;
  page: string;
  customTitle?: string;
  customDescription?: string;
}

// Page-specific metadata
const pageMetadata: Record<string, Record<string, {title: string; description: string}>> = {
  home: {
    en: {
      title: 'The Detail Shop Reno | Professional Auto Detailing',
      description: 'Premium mobile auto detailing services in Reno, NV. Ceramic coating, paint correction, interior detailing. Book your appointment today!',
    },
    es: {
      title: 'The Detail Shop Reno | Detallado Profesional de Autos',
      description: 'Servicios premium de detallado móvil de autos en Reno, NV. Recubrimiento cerámico, corrección de pintura, detallado interior. ¡Reserve su cita hoy!',
    },
  },
  services: {
    en: {
      title: 'Our Services | The Detail Shop Reno',
      description: 'Full range of auto detailing services including ceramic coating, paint correction, interior detailing, and mobile service in Reno, Nevada.',
    },
    es: {
      title: 'Nuestros Servicios | The Detail Shop Reno',
      description: 'Gama completa de servicios de detallado de autos incluyendo recubrimiento cerámico, corrección de pintura, detallado interior y servicio móvil en Reno, Nevada.',
    },
  },
  portfolio: {
    en: {
      title: 'Portfolio | The Detail Shop Reno',
      description: 'View our auto detailing work gallery. Before and after photos of ceramic coating, paint correction, and interior detailing projects.',
    },
    es: {
      title: 'Portafolio | The Detail Shop Reno',
      description: 'Vea nuestra galería de trabajo de detallado de autos. Fotos de antes y después de recubrimiento cerámico, corrección de pintura y proyectos de detallado interior.',
    },
  },
  about: {
    en: {
      title: 'About Us | The Detail Shop Reno',
      description: 'Learn about The Detail Shop Reno, your trusted auto detailing experts serving the Reno-Sparks area with professional mobile detailing services.',
    },
    es: {
      title: 'Sobre Nosotros | The Detail Shop Reno',
      description: 'Conozca a The Detail Shop Reno, sus expertos de confianza en detallado de autos sirviendo el área de Reno-Sparks con servicios profesionales de detallado móvil.',
    },
  },
  contact: {
    en: {
      title: 'Contact Us | The Detail Shop Reno',
      description: 'Get in touch with The Detail Shop Reno for a free auto detailing quote. Call us or fill out our contact form to schedule your appointment.',
    },
    es: {
      title: 'Contáctanos | The Detail Shop Reno',
      description: 'Póngase en contacto con The Detail Shop Reno para una cotización gratuita de detallado de autos. Llámenos o complete nuestro formulario de contacto para programar su cita.',
    },
  },
};

/**
 * Generate page metadata with proper hreflang and canonical tags
 */
export function generatePageMetadata({
  locale,
  page,
  customTitle,
  customDescription,
}: PageMetadataParams): Metadata {
  const meta = pageMetadata[page]?.[locale] || pageMetadata.home.en;
  const title = customTitle || meta.title;
  const description = customDescription || meta.description;

  // Build canonical URL
  const pagePath = page === 'home' ? '' : `/${page}`;
  const localePath = locale === defaultLocale ? '' : `/${locale}`;
  const canonicalUrl = `${SITE_URL}${localePath}${pagePath}/`;

  // Build alternate language URLs
  const alternates: Record<string, string> = {};
  locales.forEach((loc) => {
    const locPath = loc === defaultLocale ? '' : `/${loc}`;
    alternates[loc] = `${SITE_URL}${locPath}${pagePath}/`;
  });
  alternates['x-default'] = `${SITE_URL}${pagePath}/`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: alternates,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'The Detail Shop Reno',
      locale: locale === 'es' ? 'es_US' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Generate JSON-LD structured data for local business
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    name: 'The Detail Shop Reno',
    alternateName: 'Supreme X Detailing',
    description: 'Professional mobile auto detailing services in Reno, Nevada',
    url: SITE_URL,
    telephone: '+17754405342',
    email: 'info@thedetailshopreno.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Reno',
      addressRegion: 'NV',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 39.5296,
      longitude: -119.8138,
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 39.5296,
        longitude: -119.8138,
      },
      geoRadius: '50000',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    priceRange: '$$',
    image: `${SITE_URL}/images/og-image.jpg`,
    sameAs: [
      'https://www.instagram.com/supremexdetail/',
      'https://www.facebook.com/supremexdetailing/',
    ],
  };
}

/**
 * Generate service schema
 */
export function generateServiceSchema(service: {
  name: string;
  description: string;
  price?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'AutoRepair',
      name: 'The Detail Shop Reno',
    },
    areaServed: {
      '@type': 'City',
      name: 'Reno',
    },
    ...(service.price && {
      offers: {
        '@type': 'Offer',
        price: service.price,
        priceCurrency: 'USD',
      },
    }),
  };
}
