import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import PageHero from '@/components/layout/PageHero';
import ContactFormClient from '@/components/contact/ContactFormClient';
import {
  contentMax,
  ds,
  pageMainTopClass,
  sectionPad,
  secondaryBtnClass,
} from '@/components/home/homeTheme';

export default async function ContactPageView({ locale }: { locale: string }) {
  const t = await getTranslations('contactPage');

  return (
    <div className={pageMainTopClass} style={{ backgroundColor: ds.bgMain }}>
      <section
        style={{
          backgroundColor: ds.bgDeep,
          borderBottom: `1px solid ${ds.borderStrong}`,
        }}
      >
        <PageHero eyebrow={t('eyebrow')} title={t('headline')} subtitle={t('subheadline')} />
      </section>

      <section
        className={sectionPad}
        style={{
          backgroundColor: ds.bgAlt,
          borderTop: `1px solid ${ds.borderStrong}`,
          backgroundImage: 'linear-gradient(180deg, rgba(255,132,17,0.02) 0%, transparent 40%)',
        }}
      >
        <div className={`px-4 sm:px-6 lg:px-10 ${contentMax}`}>
          <ContactFormClient locale={locale} />
        </div>
      </section>

      <section
        className="py-14 md:py-16 border-t flex justify-center px-4"
        style={{ borderColor: ds.borderStrong, backgroundColor: ds.bgDeep }}
      >
        <Link
          href="/pricing"
          className={`${secondaryBtnClass} inline-flex justify-center px-10 py-3.5 rounded-xl text-[15px] font-semibold`}
        >
          {t('pricingFallbackCta')}
        </Link>
      </section>
    </div>
  );
}
