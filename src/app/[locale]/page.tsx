import {setRequestLocale} from 'next-intl/server';
import {routing} from '../../../i18n/routing';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Testimonials from '@/components/Testimonials';
import Packages from '@/components/Packages';
import QuickAppointments from '@/components/QuickAppointments';
import CTASection from '@/components/CTASection';
import {generatePageMetadata} from '@/lib/seo';

type Locale = (typeof routing.locales)[number];

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return generatePageMetadata({locale, page: 'home'});
}

export default async function HomePage({params}: {params: Promise<{locale: string}>}) {
  const {locale: requestedLocale} = await params;
  
  // Ensure valid locale
  const locale: Locale = routing.locales.includes(requestedLocale as Locale)
    ? requestedLocale as Locale
    : routing.defaultLocale;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Services />
      <Testimonials />
      <Packages />
      <QuickAppointments />
      <CTASection />
    </>
  );
}
