<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { VariantProps } from 'class-variance-authority';
	import { inputLabelVariants, inputVariants } from './input-container.variants';

	type InputVariant = VariantProps<typeof inputVariants>['variant'];
	type LabelVariant = VariantProps<typeof inputLabelVariants>['variant'];

	export let id: string;
	export let label: string;
	export let variant: InputVariant = 'default';
	export let labelVariant: LabelVariant = variant;
	export let errors: string[] = [];
	export let required = false;
	export let labelClassname = '';
	export let containerClassname = '';
	export let errorClassname = '';

	let inputClassname = cn(inputVariants({ variant }));
</script>

<div class={cn('flex flex-col gap-2', containerClassname)}>
	<label
		class={cn(inputLabelVariants({ variant: labelVariant, className: labelClassname }))}
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

	<slot inputClassName={inputClassname} />
</div>
