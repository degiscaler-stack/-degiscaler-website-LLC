import DirectCheckoutClient from '@/app/checkout/DirectCheckoutClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const TRIAL_PRICE_ID = 'pri_01kv288raxgwa5q3t2g7c6fam1';

export default function TrialCheckoutPage() {
  return (
    <DirectCheckoutClient priceId={TRIAL_PRICE_ID}>
      <main className="flex min-h-screen items-center justify-center px-5 py-10">
        <section className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-7 text-center shadow-2xl shadow-black/40">
          <h1 className="text-lg font-semibold tracking-tight text-white">
            Secure Checkout
          </h1>
          <p className="mt-3 text-sm leading-6 text-white/70">
            You are being redirected to the payment form.
          </p>
        </section>
      </main>
    </DirectCheckoutClient>
  );
}
