import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { loadDisplayPackages } from '@/lib/packages/public-packages';
import Hero from '@/components/home/Hero';
import TrustBar from '@/components/home/TrustBar';
import ProblemSolution from '@/components/home/ProblemSolution';
import ServicesSection from '@/components/home/ServicesSection';
import WhyUs from '@/components/home/WhyUs';
import ProcessSection from '@/components/home/ProcessSection';
import HomePricing from '@/components/home/HomePricing';
import HomeFaq from '@/components/home/HomeFaq';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import FinalCta from '@/components/home/FinalCta';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tPricing = await getTranslations({ locale, namespace: 'pricingPage' });
  const fallbackPackages = tPricing.raw('packages') as Array<{
    id: string;
    name: string;
    price: string;
    description: string;
    features: string[];
  }>;
  const allPkgs = await loadDisplayPackages(fallbackPackages);
  const homePreview = allPkgs.slice(0, 3);

  return (
    <>
      <Hero />
      <TrustBar />
      <ProblemSolution />
      <ServicesSection />
      <WhyUs />
      <ProcessSection />
      <HomePricing packages={homePreview} />
      <HomeFaq />
      <TestimonialsSection />
      <FinalCta />
    </>
  );
}
