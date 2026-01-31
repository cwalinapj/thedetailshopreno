import {setRequestLocale} from 'next-intl/server';
import {routing} from '../../../../i18n/routing';
import {generatePageMetadata} from '@/lib/seo';
import Link from 'next/link';
import { getPhone } from "@/lib/phone";

type Locale = (typeof routing.locales)[number];

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return generatePageMetadata({locale, page: 'contact'});
}

export default async function ContactPage({params}: {params: Promise<{locale: string}>}) {
  const {locale: requestedLocale} = await params;
  const locale: Locale = routing.locales.includes(requestedLocale as Locale)
    ? requestedLocale as Locale
    : routing.defaultLocale;

  setRequestLocale(locale);
  const phone = getPhone(locale);

  return (
    <section className="contact-page">
      <div className="container">
        <header className="page-header">
          <h1>Contact Us</h1>
          <p>Reach out to us for a free quote</p>
        </header>

        <div className="contact-grid">
          <div className="contact-info-section">
            <h2>Get In Touch</h2>

            <div className="contact-card">
              <div className="contact-item">
                <div className="contact-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <h3>Address</h3>
                  <p>1275 Dawson Dr. #B, Reno, NV 89523</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <h3>Email</h3>
                  <a href="mailto:alexis@supremexdetail.com">alexis@supremexdetail.com</a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <h3>Phone</h3>
                  <a href={`tel:${phone.tel}`}>{phone.display}</a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <h3>Business Hours</h3>
                  <p>Mon-Sat: 8AM - 6PM</p>
                </div>
              </div>
            </div>

            <Link
              href="https://supremexautodetail.fieldd.co/"
              target="_blank"
              rel="noopener"
              className="btn btn-primary btn-large btn-block"
            >
              Book Now
            </Link>
          </div>

          <div className="contact-form-section">
            <h2>Send a Message</h2>
            <form className="contact-form" action="https://formspree.io/f/your-form-id" method="POST">
              <div className="form-group">
                <input type="text" name="name" placeholder="Name" required className="form-input" />
              </div>
              <div className="form-group">
                <input type="email" name="email" placeholder="Email" required className="form-input" />
              </div>
              <div className="form-group">
                <input type="tel" name="phone" placeholder="Phone Number" required className="form-input" />
              </div>
              <div className="form-group">
                <input type="text" name="vehicle" placeholder="Year, Make & Model" className="form-input" />
              </div>
              <div className="form-group">
                <textarea name="message" placeholder="Message" rows={4} className="form-textarea"></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-large btn-block">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
