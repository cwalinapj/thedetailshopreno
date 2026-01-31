import {Metadata} from 'next';
import {locales} from '@/i18n';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thedetailshopreno.com';

interface PageMetadataParams {
  locale: string;
  page: string;
  customTitle?: string;
  customDescription?: string;
}

// Map page keys to URL paths
const pagePathMap: Record<string, string> = {
  home: '',
  services: 'services',
  portfolio: 'portfolio',
  about: 'about',
  contact: 'contact',
  interiorServices: 'services/interior',
  exteriorServices: 'services/exterior',
  ceramicCoatingServices: 'services/ceramic-coating',
};

// Page-specific metadata
const pageMetadata: Record<string, Record<string, {title: string; description: string}>> = {
  home: {
    en: {
      title: 'Supreme X Detailing Reno | Professional Auto Detailing Services',
      description: 'Premium mobile auto detailing services in Reno & Sparks, NV. Expert ceramic coating, paint correction, interior detailing. Call (775) 750-2920 for a free quote!',
    },
    es: {
      title: 'Supreme X Detailing Reno | Servicios Profesionales de Detallado de Autos',
      description: 'Servicios premium de detallado móvil de autos en Reno y Sparks, NV. Recubrimiento cerámico, corrección de pintura, detallado interior. ¡Llame al (775) 440-5342 para cotización gratis!',
    },
  },
  services: {
    en: {
      title: 'Auto Detailing Services | Supreme X Detailing Reno',
      description: 'Full range of professional auto detailing services in Reno, NV. Interior & exterior detailing, ceramic coating, paint correction. Book online today!',
    },
    es: {
      title: 'Servicios de Detallado de Autos | Supreme X Detailing Reno',
      description: 'Gama completa de servicios profesionales de detallado de autos en Reno, NV. Detallado interior y exterior, recubrimiento cerámico, corrección de pintura. ¡Reserve en línea hoy!',
    },
  },
  interiorServices: {
    en: {
      title: 'Interior Detailing Services Reno | Supreme X Detailing',
      description: 'Professional interior car detailing in Reno, NV. Deep cleaning, leather conditioning, stain removal, odor elimination. Transform your car\'s interior today!',
    },
    es: {
      title: 'Servicios de Detallado Interior Reno | Supreme X Detailing',
      description: 'Detallado interior profesional de autos en Reno, NV. Limpieza profunda, acondicionamiento de cuero, eliminación de manchas y olores. ¡Transforme el interior de su auto hoy!',
    },
  },
  exteriorServices: {
    en: {
      title: 'Exterior Detailing Services Reno | Supreme X Detailing',
      description: 'Professional exterior car detailing in Reno, NV. Hand wash, clay bar, polish, wax, wheel detailing, and paint protection. Make your car shine like new!',
    },
    es: {
      title: 'Servicios de Detallado Exterior Reno | Supreme X Detailing',
      description: 'Detallado exterior profesional de autos en Reno, NV. Lavado a mano, clay bar, pulido, encerado, detallado de ruedas y protección de pintura. ¡Haga brillar su auto como nuevo!',
    },
  },
  ceramicCoatingServices: {
    en: {
      title: 'Ceramic Coating Reno NV | Supreme X Detailing',
      description: 'Professional ceramic coating services in Reno, NV. Long-lasting paint protection, hydrophobic finish, UV protection. Packages starting at $599. Book now!',
    },
    es: {
      title: 'Recubrimiento Cerámico Reno NV | Supreme X Detailing',
      description: 'Servicios profesionales de recubrimiento cerámico en Reno, NV. Protección duradera de pintura, acabado hidrofóbico, protección UV. Paquetes desde $599. ¡Reserve ahora!',
    },
  },
  portfolio: {
    en: {
      title: 'Our Work | Auto Detailing Portfolio | Supreme X Detailing',
      description: 'View our auto detailing portfolio. Before and after photos of ceramic coating, paint correction, and interior detailing projects in Reno, NV.',
    },
    es: {
      title: 'Nuestro Trabajo | Portafolio de Detallado | Supreme X Detailing',
      description: 'Vea nuestro portafolio de detallado de autos. Fotos de antes y después de recubrimiento cerámico, corrección de pintura y proyectos de detallado interior en Reno, NV.',
    },
  },
  about: {
    en: {
      title: 'About Us | Supreme X Detailing Reno',
      description: 'Meet Supreme X Detailing, your trusted auto detailing experts serving the Reno-Sparks area. Professional mobile detailing with attention to detail.',
    },
    es: {
      title: 'Sobre Nosotros | Supreme X Detailing Reno',
      description: 'Conozca a Supreme X Detailing, sus expertos de confianza en detallado de autos sirviendo el área de Reno-Sparks. Detallado móvil profesional con atención al detalle.',
    },
  },
  contact: {
    en: {
      title: 'Contact Us | Supreme X Detailing Reno',
      description: 'Contact Supreme X Detailing for a free auto detailing quote in Reno, NV. Call (775) 750-2920 or fill out our form. Same-day appointments available!',
    },
    es: {
      title: 'Contáctenos | Supreme X Detailing Reno',
      description: 'Contacte a Supreme X Detailing para una cotización gratis de detallado de autos en Reno, NV. Llame al (775) 440-5342 o complete nuestro formulario. ¡Citas disponibles el mismo día!',
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

  // Get the URL path for this page
  const pagePath = pagePathMap[page] || '';
  const pathSuffix = pagePath ? `/${pagePath}` : '';

  // Build canonical URL (always include locale prefix)
  const canonicalUrl = `${SITE_URL}/${locale}${pathSuffix}`;

  // Build alternate language URLs for hreflang
  const languages: Record<string, string> = {};
  locales.forEach((loc) => {
    languages[loc] = `${SITE_URL}/${loc}${pathSuffix}`;
  });
  // x-default points to English version
  languages['x-default'] = `${SITE_URL}/en${pathSuffix}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Supreme X Detailing',
      locale: locale === 'es' ? 'es_US' : 'en_US',
      alternateLocale: locale === 'es' ? 'en_US' : 'es_US',
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/images/envato/pressure-wash-hero-1440w.jpg`,
          width: 1200,
          height: 630,
          alt: locale === 'es' ? 'Detallado Profesional de Autos' : 'Professional Auto Detailing',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/images/envato/pressure-wash-hero-1440w.jpg`],
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
    name: 'Supreme X Detailing',
    alternateName: 'The Detail Shop Reno',
    description: 'Professional mobile auto detailing services in Reno and Sparks, Nevada. Ceramic coating, paint correction, interior and exterior detailing.',
    url: SITE_URL,
    telephone: '+17757502920',
    email: 'alexis@supremexdetail.com',
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
    image: `${SITE_URL}/images/envato/pressure-wash-hero-1440w.jpg`,
    sameAs: [
      'https://www.instagram.com/supremexdetail/',
      'https://www.facebook.com/supremexdetailing/',
    ],
    availableLanguage: ['English', 'Spanish'],
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
