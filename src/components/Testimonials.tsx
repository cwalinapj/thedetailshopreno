'use client';

import {useTranslations} from 'next-intl';

const testimonials = [
  {
    id: 1,
    rating: 5,
  },
  {
    id: 2,
    rating: 5,
  },
  {
    id: 3,
    rating: 5,
  },
];

export default function Testimonials() {
  const t = useTranslations('testimonials');

  return (
    <section className="testimonials">
      <div className="container">
        <div className="testimonials-header">
          <h2>{t('title')}</h2>
          <p>{t('subtitle')}</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-rating">
                {Array.from({length: testimonial.rating}).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <blockquote className="testimonial-quote">
                "{t(`reviews.${testimonial.id}.quote`)}"
              </blockquote>
              <div className="testimonial-author">
                <div className="author-info">
                  <span className="author-name">{t(`reviews.${testimonial.id}.name`)}</span>
                  <span className="author-location">{t(`reviews.${testimonial.id}.location`)}</span>
                </div>
                <span className="verified-badge">
                  <CheckIcon />
                  {t('verified')}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="testimonials-cta">
          <a
            href="https://www.google.com/search?q=car+detailing+reno"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            {t('seeAllReviews')}
          </a>
        </div>
      </div>
    </section>
  );
}

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="#FFD700"
      stroke="#FFD700"
      strokeWidth="1"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
