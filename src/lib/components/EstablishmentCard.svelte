<script lang="ts">
	import Time from '$lib/components/Time.svelte';
	import Checkbox from './Checkbox.svelte';

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

	// TODO: Add
	// TODO: Remove
	// TODO: Edit (name/website)
	// TODO: Add image / placeholder
</script>

<article>
	<h2>{name}</h2>

	<Checkbox label="Visited" name="visited" checked={visited} />

	{#if website}
		<a href={website} target="_blank">Website</a>
	{/if}

	<Time dateTime={createdAt} />

	<address>Added by {createdBy.name}</address>
</article>
