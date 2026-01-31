'use client';

import {useTranslations} from 'next-intl';

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || 'https://assets.thedetailshopreno.com';

const works = [
  {
    before: `${CDN_URL}/images/2024/10/before-1`,
    after: `${CDN_URL}/images/2024/10/after-1`,
  },
  {
    before: `${CDN_URL}/images/2024/10/before-2`,
    after: `${CDN_URL}/images/2024/10/after-2`,
  },
  {
    before: `${CDN_URL}/images/2024/10/before-3`,
    after: `${CDN_URL}/images/2024/10/after-3`,
  },
  {
    before: `${CDN_URL}/images/2024/10/before-4`,
    after: `${CDN_URL}/images/2024/10/after-4`,
  },
];

// Responsive image for before/after cards
function ResponsiveImage({basePath, alt}: {basePath: string; alt: string}) {
  return (
    <picture>
      <source
        srcSet={`${basePath}-640w.avif 640w, ${basePath}-480w.avif 480w, ${basePath}-320w.avif 320w`}
        type="image/avif"
        sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 400px"
      />
      <source
        srcSet={`${basePath}-640w.webp 640w, ${basePath}-480w.webp 480w, ${basePath}-320w.webp 320w`}
        type="image/webp"
        sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 400px"
      />
      <img
        src={`${basePath}-480w.jpg`}
        srcSet={`${basePath}-640w.jpg 640w, ${basePath}-480w.jpg 480w, ${basePath}-320w.jpg 320w`}
        sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 400px"
        alt={alt}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}

export default function RecentWorks() {
  const t = useTranslations('recentWorks');

  return (
    <section className="recent-works" id="portfolio">
      <div className="container">
        <h2 className="section-title">{t('title')}</h2>
      </div>
      <div className="works-carousel">
        {works.map((work, index) => (
          <div key={index} className="comparison-card">
            <div className="comparison-slider">
              <div className="comparison-after">
                <ResponsiveImage basePath={work.after} alt="After detailing" />
                <span className="comparison-label after">{t('after')}</span>
              </div>
              <div className="comparison-before">
                <ResponsiveImage basePath={work.before} alt="Before detailing" />
                <span className="comparison-label before">{t('before')}</span>
              </div>
              <div className="comparison-handle" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
