import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Hero from '@/components/home/Hero';
import TrustBar from '@/components/home/TrustBar';
import ProblemSolution from '@/components/home/ProblemSolution';
import ServicesSection from '@/components/home/ServicesSection';
import WhyUs from '@/components/home/WhyUs';
import ProcessSection from '@/components/home/ProcessSection';
import HomePricing from '@/components/home/HomePricing';
import HomeFaq from '@/components/home/HomeFaq';
import FinalCta from '@/components/home/FinalCta';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <TrustBar />
      <ProblemSolution />
      <ServicesSection />
      <WhyUs />
      <ProcessSection />
      <HomePricing />
      <HomeFaq />
      <FinalCta />
    </>
  );
}
