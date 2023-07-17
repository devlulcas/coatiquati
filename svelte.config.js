import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		prerender: {
			entries: ['*']
		},
		alias: {
			'$modules/*': './src/modules',
			'$lib/*': './src/lib',
			'$/*': './src/*'
		}
	}
};

export default config;
