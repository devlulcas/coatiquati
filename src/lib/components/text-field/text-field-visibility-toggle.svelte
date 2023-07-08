<script lang="ts">
	import { Eye, EyeOff } from 'lucide-svelte';

	export let value = false;
</script>

<button
	type="button"
	aria-label="Mostrar senha"
	on:click={() => (value = !value)}
	class="p-2 rounded-md border-b bg-white/10 border-white/50 outline-none focus:border-white/80"
>
	{#if value}
		<EyeOff />
	{:else}
		<Eye />
	{/if}
</button>
