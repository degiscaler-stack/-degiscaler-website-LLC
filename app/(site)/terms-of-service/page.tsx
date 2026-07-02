import { getTranslations } from 'next-intl/server';
import LegalPage from '@/components/LegalPage';

type Section = { title: string; content: string };

export default async function TermsPage() {
  const t = await getTranslations('termsPage');
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
