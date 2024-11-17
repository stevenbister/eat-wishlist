<script lang="ts">
	import Time from '$lib/components/Time.svelte';

	interface Props {
		id: number;
		name: string;
		website: string | null;
		visited: boolean;
		createdAt: Date;
		createdBy: {
			id: string;
			name: string | null;
		};
	}

	let { name, visited, website, createdAt, createdBy }: Props = $props();
</script>

<article>
	<h2>{name}</h2>

	{#if visited}
		<p>Visited</p>
	{/if}

	{#if website}
		<a href={website} target="_blank">Website</a>
	{/if}

	<Time dateTime={createdAt} />

	<address>Added by {createdBy.name}</address>
</article>
