import type { ReactNode } from 'react';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/chat/ChatWidget';
import PaddleProvider from '@/components/paddle/PaddleProvider';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        strategy="afterInteractive"
      />
      <PaddleProvider />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <ChatWidget />
    </>
  );
}
