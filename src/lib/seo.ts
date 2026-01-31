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
  faq: 'faq',
  interiorServices: 'services/interior',
  exteriorServices: 'services/exterior',
  ceramicCoatingServices: 'services/ceramic-coating',
};

// Page-specific metadata optimized for SEO
// English: USA English with local Reno/Sparks keywords
// Spanish: Mexican Spanish natural phrasing
const pageMetadata: Record<string, Record<string, {title: string; description: string; keywords: string[]}>> = {
  home: {
    en: {
      title: 'Auto Detailing Reno NV | Mobile Car Detailing | Car Detailing Reno',
      description: '#1 rated mobile auto detailing in Reno & Sparks, Nevada. Professional ceramic coating, paint correction, interior & exterior detailing. 5-star reviews. Call (775) 750-2920 for free quote!',
      keywords: ['auto detailing reno', 'car detailing reno nv', 'mobile detailing sparks', 'ceramic coating reno'],
    },
    es: {
      title: 'Detallado de Autos Reno NV | Servicio Móvil | Car Detailing Reno',
      description: 'El mejor servicio de detallado de carros en Reno y Sparks, Nevada. Recubrimiento cerámico, corrección de pintura, limpieza interior y exterior. Hablamos español. Llame al (775) 440-5342.',
      keywords: ['detallado de autos reno', 'lavado de carros reno', 'ceramic coating español', 'detailing en español'],
    },
  },
  services: {
    en: {
      title: 'Car Detailing Services Reno NV | Full Service Auto Detail | Car Detailing Reno',
      description: 'Complete auto detailing services in Reno, Nevada. Interior cleaning, exterior wash & wax, ceramic coating, paint correction, headlight restoration. Prices from $150. Book online!',
      keywords: ['car detailing services reno', 'auto detail reno nv', 'full detail service', 'car wash reno'],
    },
    es: {
      title: 'Servicios de Detallado de Carros Reno NV | Car Detailing Reno',
      description: 'Servicios completos de detallado de autos en Reno, Nevada. Limpieza interior, lavado exterior, encerado, ceramic coating, corrección de pintura. Precios desde $150. ¡Agende hoy!',
      keywords: ['servicios detallado carros', 'lavado de autos reno', 'limpieza de carros', 'detallado completo'],
    },
  },
  interiorServices: {
    en: {
      title: 'Interior Car Detailing Reno NV | Deep Clean & Sanitize | Car Detailing Reno',
      description: 'Professional interior car detailing in Reno, NV. Steam cleaning, leather conditioning, carpet shampoo, odor removal, stain extraction. Kid & pet friendly products. From $99!',
      keywords: ['interior car detailing reno', 'car interior cleaning', 'leather conditioning', 'carpet shampoo car'],
    },
    es: {
      title: 'Limpieza Interior de Carros Reno NV | Detallado Profundo | Car Detailing Reno',
      description: 'Limpieza interior profesional de autos en Reno, NV. Lavado de vestiduras, acondicionador de piel, shampoo de alfombras, eliminación de olores y manchas. Productos seguros. Desde $99.',
      keywords: ['limpieza interior carros', 'lavado de vestiduras', 'detallado interior', 'shampoo de alfombras'],
    },
  },
  exteriorServices: {
    en: {
      title: 'Exterior Car Detailing Reno NV | Hand Wash & Polish | Car Detailing Reno',
      description: 'Premium exterior car detailing in Reno, Nevada. Hand wash, clay bar treatment, machine polish, carnauba wax, tire shine, wheel cleaning. Showroom finish guaranteed!',
      keywords: ['exterior car detailing reno', 'hand car wash reno', 'car polish', 'clay bar treatment'],
    },
    es: {
      title: 'Detallado Exterior de Carros Reno NV | Lavado a Mano | Car Detailing Reno',
      description: 'Detallado exterior premium de autos en Reno, Nevada. Lavado a mano, clay bar, pulido con máquina, encerado, brillo de llantas. ¡Garantizamos acabado de agencia!',
      keywords: ['detallado exterior carros', 'lavado a mano autos', 'pulido de carros', 'encerado profesional'],
    },
  },
  ceramicCoatingServices: {
    en: {
      title: 'Ceramic Coating Reno NV | Paint Protection | Car Detailing Reno',
      description: 'Professional ceramic coating in Reno, Nevada. 2-5 year protection, hydrophobic finish, scratch resistance, UV protection. Bronze $599, Silver $999, Gold $1499. Free consultation!',
      keywords: ['ceramic coating reno', 'paint protection film', 'car coating reno nv', 'nano ceramic coating'],
    },
    es: {
      title: 'Ceramic Coating Reno NV | Protección de Pintura | Car Detailing Reno',
      description: 'Ceramic coating profesional en Reno, Nevada. Protección de 2-5 años, acabado hidrofóbico, resistente a rayones, protección UV. Bronce $599, Plata $999, Oro $1499. ¡Consulta gratis!',
      keywords: ['ceramic coating reno', 'protección de pintura', 'recubrimiento cerámico', 'nano coating'],
    },
  },
  portfolio: {
    en: {
      title: 'Auto Detailing Portfolio | Before & After Photos | Car Detailing Reno',
      description: 'See our auto detailing results in Reno, NV. Before and after photos of ceramic coating, paint correction, interior restoration. Real customer vehicles, real transformations!',
      keywords: ['auto detailing before after', 'car detail photos', 'detailing portfolio', 'ceramic coating results'],
    },
    es: {
      title: 'Portafolio de Detallado | Fotos Antes y Después | Car Detailing Reno',
      description: 'Vea nuestros resultados de detallado de autos en Reno, NV. Fotos de antes y después de ceramic coating, corrección de pintura, restauración interior. ¡Transformaciones reales!',
      keywords: ['fotos antes después', 'resultados detallado', 'portafolio carros', 'transformación autos'],
    },
  },
  about: {
    en: {
      title: 'About Car Detailing Reno | Reno\'s Trusted Auto Detailers Since 2018',
      description: 'Meet Car Detailing Reno - Reno\'s top-rated mobile auto detailing team. Certified detailers, eco-friendly products, 100% satisfaction guarantee. Serving Reno, Sparks & Northern Nevada.',
      keywords: ['about supreme x detailing', 'reno auto detailers', 'mobile detailing team', 'certified detailers'],
    },
    es: {
      title: 'Sobre Car Detailing Reno | Detalladores de Confianza en Reno',
      description: 'Conozca a Car Detailing Reno - el equipo de detallado móvil mejor calificado de Reno. Detalladores certificados, productos ecológicos, garantía de satisfacción. Servicio en español.',
      keywords: ['sobre supreme x', 'detalladores reno', 'servicio en español', 'detallado móvil'],
    },
  },
  contact: {
    en: {
      title: 'Contact Us | Get a Free Quote | Car Detailing Reno',
      description: 'Contact Car Detailing Reno for a free auto detailing quote. Call (775) 750-2920, text, or book online. Same-day appointments in Reno & Sparks, NV. We come to you!',
      keywords: ['contact supreme x detailing', 'auto detailing quote', 'book car detail', 'reno detailing appointment'],
    },
    es: {
      title: 'Contáctenos | Cotización Gratis | Car Detailing Reno',
      description: 'Contacte a Car Detailing Reno para cotización gratis. Llame al (775) 440-5342, mande texto, o reserve en línea. Citas el mismo día en Reno y Sparks. ¡Vamos a donde usted esté!',
      keywords: ['contacto supreme x', 'cotización detallado', 'agendar cita', 'detallado en español'],
    },
  },
  faq: {
    en: {
      title: 'Auto Detailing FAQ | Common Questions | Car Detailing Reno',
      description: 'Frequently asked questions about auto detailing in Reno, NV. Learn about ceramic coating, paint correction, pricing, and what to expect. Expert answers from Car Detailing Reno.',
      keywords: ['auto detailing faq', 'car detailing questions', 'ceramic coating faq', 'detailing prices reno'],
    },
    es: {
      title: 'Preguntas Frecuentes | Detallado de Autos | Car Detailing Reno',
      description: 'Preguntas frecuentes sobre detallado de autos en Reno, NV. Información sobre ceramic coating, corrección de pintura, precios, y qué esperar. Respuestas de expertos en español.',
      keywords: ['preguntas frecuentes detallado', 'dudas ceramic coating', 'precios detallado', 'información en español'],
    },
  },
};

/**
 * Generate page metadata with proper hreflang and canonical tags
 * English: en-US (USA English)
 * Spanish: es-MX (Mexican Spanish - common in Nevada)
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
  const keywords = meta.keywords || [];

  // Get the URL path for this page
  const pagePath = pagePathMap[page] || '';
  const pathSuffix = pagePath ? `/${pagePath}` : '';

  // Build canonical URL (always include locale prefix)
  const canonicalUrl = `${SITE_URL}/${locale}${pathSuffix}`;

  // Build alternate language URLs for hreflang
  // Use regional locale codes for better SEO
  const languages: Record<string, string> = {};
  locales.forEach((loc) => {
    // Map to regional codes: en -> en-US, es -> es-MX
    const regionalCode = loc === 'es' ? 'es-MX' : 'en-US';
    languages[regionalCode] = `${SITE_URL}/${loc}${pathSuffix}`;
  });
  // x-default points to English version
  languages['x-default'] = `${SITE_URL}/en${pathSuffix}`;

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'Car Detailing Reno' }],
    creator: 'Car Detailing Reno',
    publisher: 'Car Detailing Reno',
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Car Detailing Reno',
      // Use regional locale for OpenGraph
      locale: locale === 'es' ? 'es_MX' : 'en_US',
      alternateLocale: locale === 'es' ? 'en_US' : 'es_MX',
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/images/envato/pressure-wash-hero-1440w.jpg`,
          width: 1440,
          height: 960,
          alt: locale === 'es'
            ? 'Detallado Profesional de Autos en Reno Nevada'
            : 'Professional Auto Detailing in Reno Nevada',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/images/envato/pressure-wash-hero-1440w.jpg`],
      creator: '@cardetailingreno',
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
    other: {
      'geo.region': 'US-NV',
      'geo.placename': 'Reno',
      'geo.position': '39.5296;-119.8138',
      'ICBM': '39.5296, -119.8138',
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
    name: 'Car Detailing Reno',
    alternateName: 'The Detail Shop Reno',
    description: 'Professional mobile auto detailing services in Reno and Sparks, Nevada. Ceramic coating, paint correction, interior and exterior detailing.',
    url: SITE_URL,
    telephone: '+17757502920',
    email: 'alexis@supremexdetail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1275 Dawson Dr. #B',
      addressLocality: 'Reno',
      addressRegion: 'NV',
      postalCode: '89523',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 39.5097,
      longitude: -119.8483,
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 39.5097,
        longitude: -119.8483,
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
    sameAs: [],
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
