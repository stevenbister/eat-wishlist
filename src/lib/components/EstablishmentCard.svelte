<script lang="ts">
	import Time from '$lib/components/Time.svelte';
	import Dialog from './Dialog.svelte';
	import Checkbox from './FormElements/Checkbox.svelte';
	import Input from './FormElements/Input.svelte';

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
	// TODO: Add image / placeholder
</script>

<article>
	<h2>{name}</h2>

	<Checkbox label="Visited" name="visited" checked={visited} />

	{#if website}
		<a href={website} target="_blank">Website</a>
	{/if}

	<Dialog triggerText="Edit">
		<form method="post">
			<Input label="Name" name="name" value={name} />
			<Input label="Website" name="website" value={website} />

			<button>Save</button>
		</form>
	</Dialog>

	<Time dateTime={createdAt} />

	<address>Added by {createdBy.name}</address>
</article>
