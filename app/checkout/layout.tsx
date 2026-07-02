import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import PaddleProvider from '@/components/paddle/PaddleProvider';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: 'Secure Checkout | DigiScaler',
  description: 'Complete your DigiScaler digital product purchase securely.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        strategy="afterInteractive"
      />
      <div
        className="min-h-screen bg-black"
        style={{
          fontFamily: "var(--font-inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)",
        }}
      >
        <PaddleProvider />
        {children}
      </div>
    </>
  );
}
