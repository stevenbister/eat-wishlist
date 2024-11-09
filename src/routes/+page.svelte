<script lang="ts">
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

{#if !data.user}
	<h1>Welcome guest, to SvelteKit</h1>
{:else}
	<form method="get" action="/logout">
		<button>Logout</button>
	</form>

	<h1>Welcome {data.user?.email}, to SvelteKit</h1>
{/if}

<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
