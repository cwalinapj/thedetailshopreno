import InstagramGallery from '@/components/InstagramGallery';
import {generatePageMetadata} from '@/lib/seo';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return generatePageMetadata({locale, page: 'portfolio'});
}

export default async function PortfolioPage({params}: {params: Promise<{locale: string}>}) {
  await params;

  return (
    <section className="portfolio-page">
      <div className="container">
        <header className="page-header">
          <h1>Our Work</h1>
          <p>See the results of our professional auto detailing services</p>
        </header>

        <InstagramGallery limit={18} />
      </div>
    </section>
  );
}
