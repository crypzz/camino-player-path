import { useParams } from 'react-router-dom';
import { SeoLandingPage } from '@/components/seo/SeoLandingPage';
import { SEO_LANDINGS, REGIONS, regionalize } from '@/data/seoLandings';
import NotFound from '@/pages/NotFound';

export function SolutionsLandingRoute() {
  const { slug = '' } = useParams();
  const content = SEO_LANDINGS[slug];
  if (!content) return <NotFound />;
  return (
    <SeoLandingPage
      content={content}
      sourceTag={`seo:solutions/${slug}`}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Solutions', href: '/solutions' },
        { label: content.keyword, href: `/solutions/${slug}` },
      ]}
    />
  );
}

export function RegionLandingRoute() {
  const { region = '', city = '', slug = '' } = useParams();
  const base = SEO_LANDINGS[slug];
  const regionConf = REGIONS[`${region}/${city}`];
  if (!base || !regionConf) return <NotFound />;
  const content = regionalize(base, regionConf);
  return (
    <SeoLandingPage
      content={content}
      sourceTag={`seo:${region}/${city}/${slug}`}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: regionConf.cityLabel, href: `/${region}/${city}` },
        { label: base.keyword, href: `/${region}/${city}/${slug}` },
      ]}
    />
  );
}
