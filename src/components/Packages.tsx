'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import Link from 'next/link';

type TabKey = 'fullDetail' | 'interior' | 'exterior';

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || 'https://assets.thedetailshopreno.com';

// Responsive image component for package cards
function ResponsivePackageImage({src, alt}: {src: string; alt: string}) {
  const basePath = `${CDN_URL}/images/packages/${src}`;
  
  return (
    <picture>
      <source
        srcSet={`${basePath}-640w.avif 640w, ${basePath}-480w.avif 480w, ${basePath}-320w.avif 320w`}
        type="image/avif"
        sizes="(max-width: 768px) 100vw, 400px"
      />
      <source
        srcSet={`${basePath}-640w.webp 640w, ${basePath}-480w.webp 480w, ${basePath}-320w.webp 320w`}
        type="image/webp"
        sizes="(max-width: 768px) 100vw, 400px"
      />
      <img
        src={`${basePath}-480w.jpg`}
        srcSet={`${basePath}-640w.jpg 640w, ${basePath}-480w.jpg 480w, ${basePath}-320w.jpg 320w`}
        sizes="(max-width: 768px) 100vw, 400px"
        alt={alt}
        className="pricing-card-image"
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}

// Package data for each tab
const packageData = {
  fullDetail: {
    packages: [
      {
        name: 'Bronze',
        nameColor: '#964B00',
        price: '$195',
        includes: null,
        features: ['Vacuum', 'Wipedown All Surfaces', 'Floor Mats', 'Air Freshener', 'Hand Wash & Dry', 'Wheels & Tires', 'Wax (30 Days)'],
        image: 'bronze',
      },
      {
        name: 'Silver',
        nameColor: '#808080',
        price: '$395',
        includes: '+ Bronze Package',
        features: ['Seat & Mats Shampoo', 'Leather & Plastic UV Protection', 'Clay Bar Paint', 'Iron / Tar Removal', 'Paint Enhancement Polish', 'Wax (6 Months)'],
        image: 'silver',
      },
      {
        name: 'Gold',
        nameColor: '#FFD700',
        price: '$645',
        includes: '+ Silver Package',
        features: ['Steam Clean All Surfaces', 'Carpet Shampoo', 'Spot Stain Treatment', '1-Step Paint Correction', 'Wax (12 Months)'],
        image: 'gold',
      },
    ],
  },
  interior: {
    packages: [
      {
        name: 'Standard',
        nameColor: '#333333',
        price: '$175',
        includes: null,
        features: ['Vacuum & Wipedown', 'Clean All Surfaces', 'Floor Mats', 'Air Freshener', 'Windows'],
        image: 'interior-standard',
      },
      {
        name: 'Premium',
        nameColor: '#333333',
        price: '$295',
        includes: '+ Standard Package',
        features: ['Steam Clean All Surfaces', 'Fabric Shampoo', 'Leather Conditioning', 'Plastic Protection', 'Spot Stain Treatment'],
        image: 'interior-premium',
      },
    ],
  },
  exterior: {
    packages: [
      {
        name: 'Standard',
        nameColor: '#333333',
        price: '$165',
        includes: null,
        features: ['Hand Wash & Dry', 'Clean Wheels', 'Dress Tires / Exterior Trim', 'Windows', 'Wax (30 Days)'],
        image: 'exterior-standard',
      },
      {
        name: 'Premium',
        nameColor: '#333333',
        price: '$395',
        includes: '+ Standard Package',
        features: ['Clay Bar Paint', 'Iron / Tar Removal', '1-Step Paint Correction', 'Wax (12 Months)'],
        image: 'exterior-premium',
      },
    ],
  },
};

export default function Packages() {
  const t = useTranslations('packages');
  const [activeTab, setActiveTab] = useState<TabKey>('fullDetail');

  const tabs: TabKey[] = ['fullDetail', 'interior', 'exterior'];
  const currentPackages = packageData[activeTab].packages;

  return (
    <section className="packages-section" id="packages">
      <div className="container">
        <h2 className="section-title">{t('title')}</h2>
        
        <div className="package-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`package-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              <CarIcon />
              {t(`tabs.${tab}`)}
            </button>
          ))}
        </div>

        <div className={`pricing-grid ${currentPackages.length === 2 ? 'two-columns' : ''}`}>
          {currentPackages.map((pkg, index) => (
            <div key={index} className="pricing-card">
              {pkg.image && (
                <ResponsivePackageImage 
                  src={pkg.image} 
                  alt={`${pkg.name} Package`} 
                />
              )}
              <div className="pricing-card-content">
                <h3 className="pricing-tier" style={{color: pkg.nameColor}}>{pkg.name}</h3>
                <p className="pricing-price">{pkg.price}</p>
                {pkg.includes && <p className="pricing-includes">{pkg.includes}</p>}
                <ul className="pricing-features">
                  {pkg.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
                <Link href="https://supremexautodetail.fieldd.co/" className="btn btn-primary">
                  {t('bookNow')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
    </svg>
  );
}
