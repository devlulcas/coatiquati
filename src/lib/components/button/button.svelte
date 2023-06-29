<script lang="ts">
	import type { Icon } from '$lib/types/icon';
	import { cn } from '$lib/utils/cn';
	import type { VariantProps } from 'class-variance-authority';
	import { Loader2 } from 'lucide-svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { buttonVariants } from './button.variants';

	type BaseElementProps = {
		variant?: VariantProps<typeof buttonVariants>['variant'];
		size?: VariantProps<typeof buttonVariants>['size'];
		class?: string;
		type?: HTMLButtonAttributes['type'];
		href?: HTMLAnchorAttributes['href'];
	};

	export let type: BaseElementProps['type'] = 'button';

	export let href: BaseElementProps['href'] = undefined;

	export let size: BaseElementProps['size'] = 'default';

	export let variant: BaseElementProps['variant'] = 'default';

	export let icon: Icon | undefined = undefined;

	export let loading = false;

	let className: BaseElementProps['class'] = undefined;
	export { className as class };
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	type={href ? undefined : type}
	{href}
	class={cn(buttonVariants({ variant, size, className }), {
		'animate-pulse bg-gray-700 bg-opacity-50 pointer-events-none': loading
	})}
	{...$$restProps}
	on:click
	on:change
	on:keydown
	on:keyup
	on:mouseenter
	on:mouseleave
>
	{#if loading}
		<Loader2 class="animate-spin" size={18} />
	{:else}
		<slot />

		{#if icon}
			<svelte:component this={icon} size={18} />
		{/if}
	{/if}
</svelte:element>
