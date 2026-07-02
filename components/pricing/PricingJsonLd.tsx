import type { DisplayPackage } from '@/lib/packages/public-packages';
import { buildPublicUrl, getPublicOrigin } from '@/lib/public-url';

function parsePriceLabel(priceLabel: string): string | undefined {
  const m = priceLabel.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
  return m?.[1];
}

export default function PricingJsonLd({ packages }: { packages: DisplayPackage[] }) {
  const origin = getPublicOrigin();
  const pricingUrl = buildPublicUrl('/pricing');

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Organization',
      '@id': `${origin}/#organization`,
      name: 'DegiScaler LLC',
      url: origin,
      email: 'support@degiscaler.com',
      description:
        'Premium downloadable digital business resources: optimization kits, templates, and checklists.',
    },
    {
      '@type': 'WebSite',
      '@id': `${origin}/#website`,
      url: origin,
      name: 'DigiScaler',
      publisher: { '@id': `${origin}/#organization` },
      inLanguage: ['en'],
    },
    {
      '@type': 'ItemList',
      '@id': `${pricingUrl}#kits`,
      name: 'DigiScaler digital resource kits',
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      numberOfItems: packages.length,
      itemListElement: packages.map((pkg, idx) => {
        const price = parsePriceLabel(pkg.price);
        return {
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': 'Product',
            name: pkg.title,
            description: pkg.description,
            sku: pkg.slug,
            url: `${pricingUrl}#${pkg.slug}`,
            category: 'DigitalDownload',
            offers: {
              '@type': 'Offer',
              url: buildPublicUrl(`/order?package=${encodeURIComponent(pkg.slug)}`),
              priceCurrency: 'EUR',
              ...(price ? { price } : {}),
              availability: 'https://schema.org/InStock',
              itemCondition: 'https://schema.org/NewCondition',
              deliveryMethod: 'https://schema.org/OnlineOnly',
            },
          },
        };
      }),
    },
  ];

  const json = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graph,
  });

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}
