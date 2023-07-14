<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type $$Events = {
		error: CustomEvent<{ name: string; message: string }>;
		change: CustomEvent<{ name: string; files: File[] }>;
	};

	type $$Slots = {
		default: {
			droppable: boolean;
		};
	};

	type $$Props = Omit<HTMLAttributes<HTMLDivElement>, 'class'> & {
		accept?: string[];
		max?: number;
		disabled?: boolean;
		name?: string;
		class?: string;
	};

	let className = '';
	export { className as class };

	export let accept: string[] = [];

	export let max = 1;

	export let disabled = false;
	$: if (disabled) droppable = false;

	export let name = '';

	let droppable = false;

	let input: HTMLInputElement;

	// Verifica se o tipo de arquivo é aceito
	function isAcceptedMimeType(type: string) {
		if (accept.length === 0 || accept.includes('*')) return true;
		const acceptMimesRegex = accept.map((mime) => mime.replace('*', '.*')).join('|');
		return new RegExp(acceptMimesRegex).test(type);
	}

	// Retorna a lista de arquivos aceitos
	function getAcceptedFileList(files: FileList | null | undefined): File[] {
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

	// Emissão de eventos
	const dispatch = createEventDispatcher();

	function handleFiles(files: FileList | null | undefined) {
		const acceptedFiles = getAcceptedFileList(files);

		if (acceptedFiles.length === 0) {
			dispatch('error', {
				name,
				message: `O arquivo não é um dos tipos aceitos: ${accept.join(', ')}`
			});
		} else {
			dispatch('change', {
				name,
				files: acceptedFiles
			});
		}
	}

	// Ativa o efeito indicador
	function onDragOver(event: DragEvent) {
		if (disabled) return;

		const items = Array.from(event.dataTransfer?.items ?? []);

		if (items.length > max) {
			droppable = false;
			return;
		}

		for (const item of items) {
			if (item.kind === 'file' && isAcceptedMimeType(item.type)) {
				droppable = true;
				return;
			}
		}
	}

	// Desativa o efeito indicador
	function onDragLeave() {
		if (disabled) return;
		droppable = false;
	}

	// Captura de arquivos
	function onDrop(event: DragEvent) {
		if (disabled) return;
		console.log('drop', event.dataTransfer?.files);
		handleFiles(event.dataTransfer?.files);
		droppable = false;
	}

	// Captura de arquivos
	function onChange(event: Event) {
		if (disabled) return;

		if (event.target instanceof HTMLInputElement) {
			handleFiles(event.target.files);
		}
	}

	// Atalhos de teclado
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
	on:keydown|preventDefault={onKeydown}
	on:dragover|preventDefault={onDragOver}
	on:dragleave|preventDefault={onDragLeave}
	on:drop|preventDefault={onDrop}
	on:click|preventDefault={() => input.click()}
	on:touchstart|preventDefault={() => input.click()}
	on:touchmove|preventDefault={() => input.click()}
	on:touchend|preventDefault={() => input.click()}
	class={className}
>
	<slot {droppable} />
</div>

<input
	type="file"
	accept={accept.length ? accept.join(',') : null}
	aria-hidden="true"
	hidden
	multiple={max > 1}
	{disabled}
	{name}
	bind:this={input}
	on:change|preventDefault={onChange}
/>
