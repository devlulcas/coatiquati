<script lang="ts">
	import { AlertTriangle, BadgeInfo, Smile } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	export let is: 'error' | 'warning' | 'info' | 'success' = 'error';

	const colorScheme = {
		error: 'text-red-600 bg-red-50 border-red-600',
		warning: 'text-yellow-600 bg-yellow-50 border-yellow-600',
		info: 'text-blue-600 bg-blue-50 border-blue-600',
		success: 'text-green-600 bg-green-50 border-green-600'
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
	class="mt-4 px-4 py-2 rounded-md border-[1px] flex items-center gap-2 {colorScheme}"
>
	<svelte:component this={icon} />
	<slot />
</p>
