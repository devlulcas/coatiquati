<script lang="ts">
	import type { ClassName } from '$lib/types/class-name';
	import { cn } from '$lib/utils/cn';
	import { AlertTriangle, BadgeInfo, Smile } from 'lucide-svelte';
	import { badgeVariants, type BadgeSize, type BadgeVariant } from './badge.variants';

	export let size: BadgeSize = 'default'
	export let variant: BadgeVariant = 'default'
	export let className: ClassName = ''

	let icon = {
		default: Smile,
		error: AlertTriangle,
		warning: AlertTriangle,
		info: BadgeInfo,
		success: Smile
	}[variant ?? 'default'];
</script>

<p class={cn(badgeVariants({ variant, size, className }))}>
	<svelte:component this={icon} />
	<slot />
</p>
