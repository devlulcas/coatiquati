<script lang="ts">
	export let href: string | undefined = undefined;
</script>

{#if href}
	<a
		{href}
		class="py-3 px-5 w-full text-left rounded-md bg-black/5 text-white/90 border border-white/25 backdrop-blur-md"
	>
		<slot />
	</a>
{:else}
	<button
		class="py-3 px-5 w-full text-left rounded-md bg-black/5 text-white/90 border border-white/25 backdrop-blur-md"
	>
		<slot />
	</button>
{/if}
