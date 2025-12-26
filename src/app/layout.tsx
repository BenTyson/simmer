import type { Metadata } from 'next';
import { Inter, Nunito } from 'next/font/google';
import PlausibleProvider from 'next-plausible';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomNav } from '@/components/layout/BottomNav';
import './globals.css';

// Extract domain from NEXT_PUBLIC_SITE_URL for Plausible analytics
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://emberwhisk.co';
const plausibleDomain = new URL(siteUrl).hostname;

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://emberwhisk.co'),
  title: {
    default: 'Ember Whisk - Recipe Search Without the Bloat',
    template: '%s | Ember Whisk',
  },
  description:
    'Find recipes without the life stories. Ember Whisk aggregates recipes from across the web and presents them cleanly with ingredient scaling, unit conversion, and shopping lists.',
  keywords: [
    'recipes',
    'cooking',
    'recipe search',
    'ingredient scaling',
    'shopping list',
    'meal planning',
  ],
  authors: [{ name: 'Ember Whisk' }],
  creator: 'Ember Whisk',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Ember Whisk',
    title: 'Ember Whisk - Recipe Search Without the Bloat',
    description: 'Find recipes without the life stories. Clean recipes with scaling and shopping lists.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ember Whisk - Recipe Search Without the Bloat',
    description: 'Find recipes without the life stories. Clean recipes with scaling and shopping lists.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${nunito.variable}`}>
      <head>
        <PlausibleProvider
          domain={plausibleDomain}
          customDomain="https://plausible.io"
          scriptProps={{
            src: "https://plausible.io/js/pa-QMBwFHDOGIiq2n7iw1eEC.js",
          }}
          trackOutboundLinks
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased pb-16 md:pb-0">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
