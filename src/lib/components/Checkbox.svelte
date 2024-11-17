<script lang="ts">
	interface Props {
		label: string;
		name: string;
		checked?: boolean;
	}

	let { checked, label, name }: Props = $props();
</script>

<label>
	{label}
	<input type="checkbox" {name} {checked} />
</label>
