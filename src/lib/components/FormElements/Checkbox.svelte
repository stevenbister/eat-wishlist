<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		label: string;
		name: string;
	}

	let { checked, label, name }: Props = $props();
</script>

<label>
	{label}
	<input type="checkbox" {name} {checked} />
</label>
