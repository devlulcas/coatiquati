<script lang="ts">
	import type { ClassName } from '$lib/types/class-name';
	import type { Icon } from '$lib/types/icon';
	import { cn } from '$lib/utils/cn';
	import { Loader2 } from 'lucide-svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { buttonVariants, type ButtonSize, type ButtonVariant } from './button.variants';

	export let type: HTMLButtonAttributes['type'] = 'button';
  export let href: HTMLAnchorAttributes['href'] = undefined;
	export let size: ButtonSize= 'default'
	export let variant: ButtonVariant= 'default'
	export let icon: Icon | null = null;
	export let loading = false;
	export let className: ClassName = '';
</script>

<svelte:element
  aria-busy={loading}
  aria-disabled={loading}
  role="button"
  tabindex="0"
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
		<svelte:component this={icon} size={18} />
	{/if}
</svelte:element>
