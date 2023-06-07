<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { AlertTriangle, BadgeInfo, Smile } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	export let is: 'error' | 'warning' | 'info' | 'success' = 'error';

	const colorScheme = {
		error: 'bg-red-500/75',
		warning: 'bg-yellow-500/75',
		info: 'bg-blue-500/75',
		success: 'bg-green-500/75'
	}[is];

	let icon = {
		error: AlertTriangle,
		warning: AlertTriangle,
		info: BadgeInfo,
		success: Smile
	}[is];
</script>

<p
	transition:fade={{ duration: 1000 }}
	class={cn('text-white w-full p-2 rounded-md flex items-center gap-2 font-semibold', colorScheme)}
>
	<svelte:component this={icon} />
	<slot />
</p>
