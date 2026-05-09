import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import { routing } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/chat/ChatWidget';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const isRtl = locale === 'ar';

  return (
    <html
      lang={locale}
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`${inter.variable}`}
    >
      <head>
        {isRtl && (
          <link
            href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap"
            rel="stylesheet"
          />
        )}
      </head>
      <body
        className="antialiased"
        style={{
          fontFamily: isRtl
            ? "'Cairo', system-ui, sans-serif"
            : "var(--font-inter, system-ui, sans-serif)",
          backgroundColor: '#050505',
          color: '#F5F2E9',
        }}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ChatWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
