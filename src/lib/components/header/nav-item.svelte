<script lang="ts">
	import { cva } from 'class-variance-authority';

	export let href: string | undefined = undefined;

	const navItemVariants = cva(
		'py-3 px-4 w-full text-left rounded-lg backdrop-blur-md border cursor-pointer',
		{
			variants: {
				variant: {
					default: 'bg-white/5 text-white/90 border-white/10',
					button: 'bg-red-400/5 text-red-500 border-red-500/25'
				}
			}
		}
	);
</script>

{#if href}
	<a {href} class={navItemVariants({ variant: 'default' })}>
		<slot />
	</a>
{:else}
	<button class={navItemVariants({ variant: 'button' })}>
		<slot />
	</button>
{/if}
