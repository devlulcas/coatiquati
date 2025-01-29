import { env } from '@/env';
import { AnimatedBlobBackgroundScript } from '@/modules/layout/components/animated-blob-background-script';
import { Header } from '@/modules/layout/components/header';
import { MainLayoutWrapper } from '@/modules/layout/components/main-layout-wrapper';
import { getFontQuery } from '@/modules/theme/actions/change-font-mutation';
import { getThemeQuery } from '@/modules/theme/actions/change-theme-mutation';
import { Providers } from '@/shared/components/common/providers';
import { Toaster } from '@/shared/components/ui/toaster';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import localFont from 'next/font/local';
import '../shared/assets/styles/globals.css';
import '../shared/assets/styles/utils.css';

const sans = Poppins({ weight: ['400', '500', '600', '700', '800', '900'], subsets: ['latin'], preload: true });
const dyslexic = localFont({
  src: [
    {
      path: '../shared/assets/fonts/open-dyslexic-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../shared/assets/fonts/open-dyslexic-italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../shared/assets/fonts/open-dyslexic-bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../shared/assets/fonts/open-dyslexic-bold-italic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
})

export const metadata: Metadata = {
  title: 'CoatiQuati',
  description: 'CoatiQuati é uma plataforma de estudos para tudo e todos.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: env.NEXT_PUBLIC_WEBSITE,
    siteName: 'CoatiQuati',
    title: 'CoatiQuati',
    description: 'CoatiQuati é uma plataforma de estudos para tudo e todos.',
    images: [
      {
        url: env.NEXT_PUBLIC_WEBSITE + '/og.png',
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
  const theme = await getThemeQuery()
  const font = await getFontQuery()

  return (
    <html
      lang="pt-br"
      className={theme.value}
      style={{ ['--font-sans' as string]: font.value === 'common' ? sans.style.fontFamily : dyslexic.style.fontFamily }}>
      <head>
        <link href="favicon.svg" rel="icon" />
      </head>
      <body >
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
