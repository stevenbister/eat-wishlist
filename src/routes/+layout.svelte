<script lang="ts">
	import LogoutButton from '$lib/components/LogoutButton.svelte';
	import type { LayoutData } from './$types';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let { children, data }: { children: () => any; data: LayoutData } = $props();
</script>

<header>
	{#if data.user}
		<LogoutButton />
	{/if}
</header>

<main>
	{@render children()}
</main>
