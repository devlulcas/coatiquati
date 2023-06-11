<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { CheckIcon } from 'lucide-svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type $$Props = {
		id: string;
		name: string;
		value: string;
		label: string;
	} & HTMLInputAttributes;

	export let id: string;
	export let name: string;
	export let value: string;
	export let label: string;
</script>

<div class="h-10 relative">
	<input class="peer sr-only" type="radio" {id} {name} {value} {...$$restProps} />

	<CheckIcon
		class={cn(
			'pointer-events-none',
			'absolute top-1/2 left-5 transform -translate-x-1/2 -translate-y-1/2',
			'w-4 h-4 text-white opacity-0 peer-checked:opacity-100',
			'transition-opacity duration-100 ease-in-out'
		)}
	/>

	<label
		class={cn(
			'flex items-center gap-2 py-2 px-2 rounded-md cursor-pointer bg-white/95',
			'peer-checked:bg-purple-500/95 peer-checked:text-white',
			'before:block before:w-6 before:h-6 before:rounded-md before:border-2 before:border-purple-700 ',
			'peer-checked:before:bg-purple-700',
			'hover:border-gray-400 focus-within:border-gray-400',
			'transition-colors duration-100 ease-in-out'
		)}
		for={id}
	>
		{label}
	</label>
</div>

<style>
	label::before {
		pointer-events: none;
	}
</style>
