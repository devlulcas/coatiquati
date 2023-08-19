import { AnimatedBlobBackgroundScript } from '@/shared/components/common/animated-blob-background-script';
import { Header } from '@/shared/components/common/header';
import { Toaster } from '@/shared/components/ui/toaster';
import { cn } from '@/shared/utils/cn';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../shared/assets/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Coatiquati',
  description: 'Learn by teaching',
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

        <Toaster />

        <div className="min-h-[100dvh] backdrop-blur-xl">
          <Header />
          <div className="min-h-[--view-height]">{children}</div>
        </div>
      </body>
    </html>
  );
}
