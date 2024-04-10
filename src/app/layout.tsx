import { AnimatedBlobBackgroundScript } from '@/modules/layout/components/animated-blob-background-script';
import { Header } from '@/modules/layout/components/header';
import { MainLayoutWrapper } from '@/modules/layout/components/main-layout-wrapper';
import { Providers } from '@/shared/components/common/providers';
import { Toaster } from '@/shared/components/ui/toaster';
import { cn } from '@/shared/utils/cn';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../shared/assets/styles/globals.css';
import '../shared/assets/styles/utils.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CoatiQuati',
  description: 'CoatiQuati é uma plataforma de estudos para tudo e todos.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://coatiquati.wiki',
    siteName: 'CoatiQuati',
    title: 'CoatiQuati',
    description: 'CoatiQuati é uma plataforma de estudos para tudo e todos.',
    images: [
      {
        url: 'https://coatiquati.wiki/og.png',
        width: 1200,
        height: 630,
        alt: 'CoatiQuati',
      },
    ],
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-br">
      <head>
        <link href="favicon.svg" rel="icon" />
      </head>
      <body className={cn(inter.className, 'dark')}>
        <AnimatedBlobBackgroundScript />

        <Providers>
          <Toaster />

          <MainLayoutWrapper>
            <Header />
            <div className="min-h-[--view-height] overflow-x-hidden">{children}</div>
          </MainLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
