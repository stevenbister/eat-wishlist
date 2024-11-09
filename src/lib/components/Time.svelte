<script lang="ts">
	let { dateTime }: { dateTime: Date } = $props();
</script>

<time datetime={dateTime.toString()}>
	{dateTime.toLocaleDateString('en-GB', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})}
</time>
