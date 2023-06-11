<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { VariantProps } from 'class-variance-authority';
	import { AlertTriangle, BadgeInfo, Smile } from 'lucide-svelte';
	import { badgeVariants } from './badge.variants';

	type BaseElementProps = {
		variant?: VariantProps<typeof badgeVariants>['variant'];
		size?: VariantProps<typeof badgeVariants>['size'];
		class?: string;
	};

	export let size: BaseElementProps['size'] = 'default';

	export let variant: BaseElementProps['variant'] = 'default';

	let className: BaseElementProps['class'] = undefined;
	export { className as class };

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
