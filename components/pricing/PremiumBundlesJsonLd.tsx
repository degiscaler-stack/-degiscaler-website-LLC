import { PREMIUM_BUNDLES } from '@/lib/pricing/premium-bundles';
import { buildPublicUrl, getPublicOrigin } from '@/lib/public-url';

export function buildPremiumBundlesItemList(): Record<string, unknown> {
  const origin = getPublicOrigin();
  const homeUrl = buildPublicUrl('/');

  return {
    '@type': 'ItemList',
    '@id': `${homeUrl}#premium-digital-bundles-list`,
    name: 'DigiScaler premium digital resource bundles',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: PREMIUM_BUNDLES.length,
    itemListElement: PREMIUM_BUNDLES.map((bundle, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Product',
        '@id': `${homeUrl}#${bundle.id}`,
        name: bundle.name,
        description: bundle.description,
        sku: bundle.id,
        url: `${homeUrl}#${bundle.id}`,
        category: 'DigitalDownload',
        offers: {
          '@type': 'Offer',
          url: `${homeUrl}#${bundle.id}`,
          priceCurrency: bundle.currency,
          price: bundle.schemaPrice,
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
          deliveryMethod: 'https://schema.org/OnlineOnly',
        },
      },
    })),
  };
}

export default function PremiumBundlesJsonLd() {
  const origin = getPublicOrigin();
  const json = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${origin}/#organization`,
      },
      buildPremiumBundlesItemList(),
    ],
  });

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}
