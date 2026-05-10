import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import PageHero from '@/components/layout/PageHero';
import {
  contentMax,
  ds,
  pageMainTopClass,
  sectionPad,
  primaryBtnClass,
} from '@/components/home/homeTheme';

export default async function ThankYouPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { locale } = await params;
  const q = await searchParams;
  const type = typeof q.type === 'string' ? q.type.trim() : '';

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'thankYouPage' });

  const isOrder = type === 'order';
  const isContact = type === 'contact';
  const title = isOrder ? t('orderTitle') : isContact ? t('contactTitle') : t('orderTitle');
  const body = isOrder ? t('orderBody') : isContact ? t('contactBody') : t('invalid');

  return (
    <div className={pageMainTopClass} style={{ backgroundColor: ds.bgMain }}>
      <section
        style={{
          backgroundColor: ds.bgDeep,
          borderBottom: `1px solid ${ds.borderStrong}`,
        }}
      >
        <PageHero eyebrow="DegiScaler" title={title} subtitle={body} />
      </section>

      <section className={sectionPad} style={{ backgroundColor: ds.bgAlt }}>
        <div className={`px-4 sm:px-6 lg:px-10 ${contentMax}`}>
          <Link
            href="/"
            className={`${primaryBtnClass} inline-flex justify-center px-10 py-3.5 rounded-xl text-[15px] font-semibold`}
          >
            {t('backHome')}
          </Link>
        </div>
      </section>
    </div>
  );
}
