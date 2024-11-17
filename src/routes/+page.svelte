<script lang="ts">
	import { enhance } from '$app/forms';
	import Dialog from '$lib/components/Dialog.svelte';
	import EstablishmentCard from '$lib/components/EstablishmentCard.svelte';
	import Input from '$lib/components/FormElements/Input.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let dialog: HTMLDialogElement | undefined = $state();
</script>

<ul>
	{#each data.establishmentList as establishment}
		<li>
			<EstablishmentCard {...establishment} userId={data.user.id} />
		</li>
	{/each}
</ul>

<Dialog triggerText="Add" bind:dialog>
	<form method="POST" action="/establishment/add" use:enhance onsubmit={() => dialog?.close()}>
		<Input label="Name" name="name" autofocus />
		<Input label="Website" name="website" />

		<button>Add</button>
	</form>
</Dialog>
