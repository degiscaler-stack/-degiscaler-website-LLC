import './globals.css';
import type { ReactNode } from 'react';

/** Single root document — locale pages set `lang` / `dir` via inline sync script in `[locale]/layout`. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
