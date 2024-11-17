<script lang="ts">
	import type { HTMLDialogAttributes } from 'svelte/elements';

	let dialog: HTMLDialogElement;

	interface Props extends HTMLDialogAttributes {
		triggerText: string;
	}

	let { children, triggerText }: Props = $props();
</script>

<dialog bind:this={dialog}>
	<button onclick={() => dialog.close()}>close</button>

	{@render children?.()}
</dialog>

<button onclick={() => dialog.showModal()}>{triggerText}</button>
