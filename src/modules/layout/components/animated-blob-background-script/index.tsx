import Script from 'next/script';
import { memo } from 'react';

function AnimateBlobScript() {
  return <Script src="/js/animated-blob-background.mjs" strategy="lazyOnload" type="module" />;
}

export const AnimatedBlobBackgroundScript = memo(AnimateBlobScript);
