<script lang="ts">
	import type { HTMLDialogAttributes } from 'svelte/elements';
	interface Props extends HTMLDialogAttributes {
		triggerText: string;
		dialog?: HTMLDialogElement;
	}

	let { children, triggerText, dialog = $bindable(), ...rest }: Props = $props();
</script>

<dialog bind:this={dialog} {...rest}>
	<button onclick={() => dialog?.close()}>close</button>

	{@render children?.()}
</dialog>

<button onclick={() => dialog?.showModal()}>{triggerText}</button>
