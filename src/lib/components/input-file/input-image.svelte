<script lang="ts">
	import { Badge } from '$lib/components/badge/';
	import { UploadedImage } from '$lib/components/uploaded-image';
	import { cn } from '$lib/utils/cn';
	import { FileDrop } from 'svelte-droplet';

	export let errors: string[] | null | undefined = null;

	let acceptedFile: { preview: string; file: File } | null = null;

	function handleFiles(files: File[]) {
		const reader = new FileReader();
		const file = files[0];

		reader.readAsDataURL(file);

		reader.onload = () => {
			acceptedFile = {
				preview: reader.result as string,
				file
			};
		};
	}

	$: {
		if (errors?.length) {
			acceptedFile = null;
		}
	}
</script>

<div class="bg-white/95 p-4 rounded-md flex flex-col gap-2">
	{#if errors}
		{#each errors as error}
			<Badge variant="error" class="text-sm">
				{error}
			</Badge>
		{/each}
	{/if}

	<FileDrop
		name="thumbnail"
		max={1}
		acceptedMimes={['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']}
		{handleFiles}
		let:droppable
	>
		<div
			class={cn(
				'bg-white/95 w-full border-2 border-dashed rounded-md border-purple-400 text-center p-4 font-semibold text-purple-800',
				droppable && 'bg-purple-100 border-purple-700'
			)}
		>
			<span> Selecione ou arraste uma imagem </span>
		</div>
	</FileDrop>

	{#if acceptedFile}
		<UploadedImage
			on:delete={() => (acceptedFile = null)}
			alt="Imagem de preview"
			width={300}
			height={300}
			id={acceptedFile.file.name}
			base64={acceptedFile.preview}
		/>
	{/if}
</div>
