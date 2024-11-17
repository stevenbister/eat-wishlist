<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		label: string;
	}

	let { name, label, value, ...rest }: Props = $props();
</script>

<label>
	{label}

	<input type="text" {name} {value} {...rest} />
</label>
