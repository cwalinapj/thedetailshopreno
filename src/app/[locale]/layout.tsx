import {NextIntlClientProvider} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {routing} from '../../../i18n/routing';
import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GTMScript from '@/components/GTMScript';
import '@/styles/globals.css';

import enMessages from '../../../messages/en.json';
import esMessages from '../../../messages/es.json';

type Locale = (typeof routing.locales)[number];

const messagesMap: Record<Locale, typeof enMessages> = {
  en: enMessages,
  es: esMessages
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale: requestedLocale} = await params;
  
  // Ensure valid locale
  const locale: Locale = routing.locales.includes(requestedLocale as Locale)
    ? requestedLocale as Locale
    : routing.defaultLocale;

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the specific locale
  const messages = messagesMap[locale];

  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang={locale}>
      <head>
        <GTMScript />
        <link rel="preconnect" href="https://assets.thedetailshopreno.com" />
        <link rel="dns-prefetch" href="https://assets.thedetailshopreno.com" />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <TopBar />
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
        <noscript>
          <iframe
            src={"https://www.googletagmanager.com/ns.html?id=" + gtmId}
            height="0"
            width="0"
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>
      </body>
    </html>
  );
}
