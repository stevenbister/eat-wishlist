<script lang="ts">
	import EstablishmentCard from '$lib/components/EstablishmentCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<ul>
	{#each data.results as establishment}
		<li>
			<EstablishmentCard {...establishment} />
		</li>
	{/each}
</ul>
