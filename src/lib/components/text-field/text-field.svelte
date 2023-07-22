<script lang="ts">
	import type { ClassName } from '$lib/types/class-name';
	import { cn } from '$lib/utils/cn';
	import type { VariantProps } from 'class-variance-authority';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import TextFieldErrorMessage from './text-field-error-message.svelte';
	import TextFieldVisibilityToggle from './text-field-visibility-toggle.svelte';
	import { inputLabelVariants, inputVariants } from './text-field.variants';

	type InputVariant = VariantProps<typeof inputVariants>['variant'];
	type LabelVariant = VariantProps<typeof inputLabelVariants>['variant'];
	type FormError = string[] | null | undefined;

	type $$Props = HTMLInputAttributes & {
		id: string;
		label: string;
		errors?: FormError;
		required?: boolean;
		variant?: InputVariant;
		labelVariant?: LabelVariant;
		labelClassname?: string;
		showVisibilityButton?: boolean;
	};

	export let id  = '';
	export let value = '';
	export let label = '';
	export let required = false;
	export let errors: FormError = null;
	export let variant: InputVariant = 'default';
	export let labelVariant: LabelVariant = variant;
	export let labelClassname: ClassName = ''
	export let className: ClassName = '';
	export let showVisibilityButton = false;

	let inputClassname = cn(inputVariants({ variant, className }));

	const errorId = id + '-' + 'error';

	let showValue = $$restProps.type !== 'password';

	$: {
		if (showVisibilityButton) {
			$$restProps.type = showValue ? 'text' : 'password';
		}
	}
</script>

<div class="flex flex-col gap-2 w-full">
	<label class={cn(inputLabelVariants({ variant: labelVariant, className: labelClassname }))} for={id}>
		{label}

		{#if required}
			<span class="text-white">*</span>
		{/if}
	</label>

	<div class="flex gap-2 w-full">
		<input {...$$restProps} class={inputClassname} {id} aria-errormessage={errorId} bind:value />

		{#if showVisibilityButton}
			<TextFieldVisibilityToggle bind:value={showValue} />
		{/if}
	</div>

	<TextFieldErrorMessage id={errorId} {errors} />
</div>
