import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineWorkersConfig({
	plugins: [sveltekit()],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		poolOptions: {
			workers: {
				wrangler: { configPath: './wrangler.toml' }
			}
		}
	}
});
