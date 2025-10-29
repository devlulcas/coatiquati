import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  workspaces: {
    '.': {
      // Entry files {@link https://knip.dev/explanations/entry-files}
      entry: [
        // Next.js File-system conventions {@link https://nextjs.org/docs/app/api-reference/file-conventions}
        'src/app/default.{tsx,jsx,ts,mjs,js}',
        'src/app/error.{tsx,jsx,ts,mjs,js}',
        'src/app/global-error.{tsx,jsx,ts,mjs,js}',
        'src/app/forbidden.{tsx,jsx,ts,mjs,js}',
        'src/{instrumentation,instrumentation-client,middleware}.{tsx,jsx,ts,mjs,js}',
        'src/app/layout.{tsx,jsx,ts,mjs,js}',
        'src/app/loading.{tsx,jsx,ts,mjs,js}',
        'src/app/mdx-components.{tsx,jsx,ts,mjs,js}',
        'src/app/not-found.{tsx,jsx,ts,mjs,js}',
        'src/app/page.{tsx,jsx,ts,mjs,js}',
        'src/app/proxy.{tsx,jsx,ts,mjs,js}',
        'src/app/route.{tsx,jsx,ts,mjs,js}',
        'src/app/template.{tsx,jsx,ts,mjs,js}',
        'src/app/unauthorized.{tsx,jsx,ts,mjs,js}',

        // Next.js File-system conventions for metadata {@link https://nextjs.org/docs/app/api-reference/file-conventions/metadata} (rss and other metadata files are not included because they are generated using route.ts files)
        'src/app/{favicon,icon,apple-icon}.{tsx,jsx,ts,mjs,js}',
        'src/app/{manifest,robots,sitemap}.{tsx,jsx,ts,mjs,js}',
        'src/app/{opengraph,twitter}-image.{tsx,jsx,ts,mjs,js}',

        // Config files
        '*.config.{js,mjs,ts}',

        // Scripts
        'cli/**/*.{mjs,ts}',
      ],
      project: ['src/**/*.{ts,tsx,js,jsx}'],
      ignore: ['src/shared/components/ui/*.{ts,tsx,js,jsx}'],
    },
  },
};

export default config;
