<script lang="ts">
	import { enhance } from '$app/forms';
	import { AdminSection } from '$lib/components/admin-section';
	import { Button } from '$lib/components/button';
	import { InputContainer } from '$lib/components/input-container';
	import { TrailCard } from '$lib/components/trail-card';
	import { UploadedImage } from '$lib/components/uploaded-image';
	import { cn } from '$lib/utils/cn';
	import { FileDrop } from 'svelte-droplet';

	export let data;

	export let form;

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
</script>

<AdminSection title="Gerenciar conteúdo">
	<form
		use:enhance
		enctype="multipart/form-data"
		method="POST"
		action="?/createTrail"
		class="lc-box flex flex-col gap-4"
	>
		<h2 class="text-2xl font-bold">Criar trilha</h2>

		<InputContainer id="title" let:inputClassName variant="opaque" label="Título">
			<input id="title" class={inputClassName} name="title" type="text" />
		</InputContainer>

		<InputContainer let:inputClassName id="description" variant="opaque" label="Descrição">
			<textarea
				id="description"
				class={cn(inputClassName, 'resize-none')}
				name="description"
				rows={3}
			/>
		</InputContainer>

		<InputContainer
			let:inputClassName
			id="imageAlt"
			variant="opaque"
			label="Texto alternativo da imagem"
		>
			<input id="imageAlt" class={inputClassName} name="imageAlt" type="text" />
		</InputContainer>

		<div class="bg-white/95 p-4 rounded-md flex flex-col gap-2">
			<FileDrop
				name="image"
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

		{#if form}
			<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
				<strong class="font-bold">Ops!</strong>
				<span class="block sm:inline">{JSON.stringify(form, null, 2)}</span>
			</div>
		{/if}

		<Button type="submit">Criar</Button>
	</form>
</AdminSection>

<div class="grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2">
	{#each data.trails as trail}
		<TrailCard {trail} editable />
	{/each}
</div>
