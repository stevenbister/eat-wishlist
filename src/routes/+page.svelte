<script lang="ts">
	import Dialog from '$lib/components/Dialog.svelte';
	import EstablishmentCard from '$lib/components/EstablishmentCard.svelte';
	import Input from '$lib/components/FormElements/Input.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<ul>
	{#each data.establishmentList as establishment}
		<li>
			<EstablishmentCard {...establishment} />
		</li>
	{/each}
</ul>

<Dialog triggerText="Add">
	<form method="post">
		<Input label="Name" name="name" />
		<Input label="Website" name="website" />

		<button>Add</button>
	</form>
</Dialog>
