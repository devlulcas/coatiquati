<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type $$Events = {
		error: CustomEvent<{ name: string; message: string }>;
		change: CustomEvent<{ name: string; files: File[] }>;
	};

	type $$Slots = {
		default: {
			canDrop: boolean;
		};
	};

	type $$Props = Omit<HTMLAttributes<HTMLDivElement>, 'class'> & {
		accept?: string[];
		max?: number;
		disabled?: boolean;
		name?: string;
		class?: ClassName;
	};

	type ClassName = (data: { droppable: boolean }) => string | string;
	let className: ClassName = () => '';
	export { className as class };

	export let accept: string[] = [];

	export let max = 1;

	export let disabled = false;
	$: if (disabled) canDrop = false;

	export let name = '';

	let canDrop = false;

	const dispatch = createEventDispatcher();

	let input: HTMLInputElement;

	function isAcceptedMimeType(type: string) {
		if (accept.length === 0 || accept.includes('*')) return true;
		const acceptMimesRegex = accept.map((mime) => mime.replace('*', '.*')).join('|');
		return new RegExp(acceptMimesRegex).test(type);
	}

	function getAcceptedFileList(files: FileList | null | undefined): File[] {
		console.log(files);
		if (!files) return [];

		const acceptedFiles: File[] = [];

		if (accept.length === 0 || accept.includes('*')) {
			return Array.from(files);
		}

		for (const file of files) {
			if (isAcceptedMimeType(file.type)) {
				acceptedFiles.push(file);
			}
		}

		if (acceptedFiles.length > max) {
			return acceptedFiles.slice(0, max);
		}

		return acceptedFiles;
	}

	function handleFiles(files: FileList | null | undefined) {
		const acceptedFiles = getAcceptedFileList(files);

		if (acceptedFiles.length === 0) {
			dispatch('error', {
				name,
				message: `O arquivo não é um dos tipos aceitos: ${accept.join(', ')}`
			});
			return;
		}

		dispatch('change', {
			name,
			files: acceptedFiles
		});
	}

	function onDragOver(event: DragEvent) {
		if (disabled) return;

		const items = Array.from(event.dataTransfer?.items ?? []);

		if (items.length > max) {
			canDrop = false;
			return;
		}

		for (const item of items) {
			if (item.kind === 'file' && isAcceptedMimeType(item.type)) {
				canDrop = true;
				return;
			}
		}
	}

	function onDragLeave() {
		if (disabled) return;
		canDrop = false;
	}

	function onDrop(event: DragEvent) {
		if (disabled) return;
		handleFiles(event.dataTransfer?.files);
		canDrop = false;
	}

	function onChange(event: Event) {
		if (disabled) return;

		if (event.target instanceof HTMLInputElement) {
			handleFiles(event.target.files);
		}
	}

	function onKeydown(event: KeyboardEvent) {
		if (disabled) return;

		if (event.key === 'Enter' || event.key === ' ') {
			input.click();
		}

		if (event.key === 'Escape') {
			input.value = '';
		}
	}
</script>

<div
	{...$$restProps}
	aria-disabled={disabled}
	aria-dropeffect="copy"
	aria-label="Arraste e solte um arquivo aqui ou clique para selecionar"
	role="button"
	tabindex="0"
	on:keydown|preventDefault|stopPropagation={onKeydown}
	on:dragover|preventDefault|stopPropagation={onDragOver}
	on:dragleave|preventDefault|stopPropagation={onDragLeave}
	on:drop|preventDefault|stopPropagation={onDrop}
	on:click|preventDefault|stopPropagation={() => input.click()}
	on:touchstart|preventDefault|stopPropagation={() => input.click()}
	on:touchmove|preventDefault|stopPropagation={() => input.click()}
	on:touchend|preventDefault|stopPropagation={() => input.click()}
	class={className instanceof Function ? className({ droppable: canDrop }) : className}
>
	<slot canDrop />
</div>

<input
	class="hidden"
	type="file"
	accept={accept.length ? accept.join(',') : null}
	aria-hidden="true"
	hidden
	multiple={max > 1}
	{disabled}
	{name}
	bind:this={input}
	on:change|preventDefault|stopPropagation={onChange}
	on:abort|preventDefault|stopPropagation
/>
