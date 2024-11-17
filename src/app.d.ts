// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

interface Env {
	DB: D1Database;
	ENVIRONMENT: 'development' | 'preview' | 'production';
}

declare global {
	namespace App {
		interface Platform {
			env: Env;
			cf: CfProperties;
			ctx: ExecutionContext;
		}

		interface Locals {
			user: import('$lib/server/db/Session').SessionValidationResult['user'];
			session: import('$lib/server/db/Session').SessionValidationResult['session'];
			db: import('$lib/server/db/connection').DbClient;
		}
	}
}

declare module 'cloudflare:test' {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface ProvidedEnv extends Env {}
}

export {};
