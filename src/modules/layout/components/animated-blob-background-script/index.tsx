import Script from 'next/script';

export function AnimatedBlobBackgroundScript() {
  return <Script src="/js/animated-blob-background.mjs" strategy="lazyOnload" type="module" />;
}
