<script lang="ts">
	import type { Nullish } from '$lib/types/nullish';
	import { cn } from '$lib/utils/cn';

	export let id: string;
	export let label: string;
	export let name: string;

	export let readOnlyLabel = false;
	export let variant: 'semi-transparent' | 'opaque' = 'semi-transparent';
	export let errors: string[] = [];
	export let value: Nullish<string> = '';
	export let type = 'text';
	export let required = false;
	export let labelClassname = '';
	export let inputClassname = '';
	export let containerClassname = '';
	export let errorClassname = '';
	export let placeholder = '';
</script>

<div class={cn('flex flex-col gap-2', containerClassname)}>
	<label
		class={cn(
			'font-bold text-md flex gap-2',
			{
				'text-white': variant === 'semi-transparent',
				'text-black/90': variant === 'opaque',
				'sr-only': readOnlyLabel
			},
			labelClassname
		)}
		for={id}
	>
		{label}

		{#if required}
			<span class="text-red-600">*</span>
		{/if}

		{#if errors.length}
			<p class={cn('text-red-600', errorClassname)}>
				{new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' }).format(errors)}
			</p>
		{/if}
	</label>

	<input
		{type}
		{id}
		{name}
		{value}
		{required}
		{placeholder}
		on:input
		on:focus
		on:blur
		class={cn(
			'w-full p-2 rounded-md border-b border-white/50 outline-none focus:border-white/80',
			{
				'text-white bg-white/10': variant === 'semi-transparent',
				'text-black/90 bg-white': variant === 'opaque'
			},
			inputClassname
		)}
	/>
</div>
