import { getTranslations } from 'next-intl/server';
import LegalPage from '@/components/LegalPage';

type Section = { title: string; content: string };

export default async function RefundPage() {
  const t = await getTranslations('refundPage');
  const sections: Section[] = t.raw('sections') as Section[];

  return (
    <LegalPage
      eyebrow={t('eyebrow')}
      headline={t('headline')}
      lastUpdated={t('lastUpdated')}
      intro={t('intro')}
      sections={sections}
      disclaimer={t('legalDisclaimer')}
    />
  );
}
