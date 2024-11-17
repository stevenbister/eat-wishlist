<script lang="ts">
	import { enhance } from '$app/forms';
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
		userId: string;
	}

	let { id, name, visited, website, createdAt, createdBy, userId }: Props = $props();
	let dialog: HTMLDialogElement | undefined = $state();
</script>

<article>
	<h2>{name}</h2>

	<Checkbox label="Visited" name="visited" checked={visited} />

	{#if website}
		<a href={website} target="_blank">Website</a>
	{/if}

	<Dialog triggerText="Edit">
		<form method="POST">
			<Input label="Name" name="name" value={name} />
			<Input label="Website" name="website" value={website} />

			<button>Save</button>
		</form>
	</Dialog>

	<Time dateTime={createdAt} />

	<address>Added by {createdBy.name}</address>

	<!-- TODO: move this into own component probs -->
	{#if userId === createdBy.id}
		<Dialog triggerText="Delete" bind:dialog>
			<form
				method="POST"
				action="/establishment/delete"
				use:enhance
				onsubmit={() => dialog?.close()}
			>
				<input type="hidden" name="createdBy" value={createdBy.id} />
				<button name="id" value={id}>Delete</button>
				<button onclick={() => dialog?.close()}>Cancel</button>
			</form>
		</Dialog>
	{/if}
</article>
