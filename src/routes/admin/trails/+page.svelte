<script lang="ts">
	import { Badge } from '$lib/components/badge';
	import { Button } from '$lib/components/button';
	import { SectionHeading } from '$lib/components/heading';
	import { InputFile } from '$lib/components/input-file';
	import { TextField } from '$lib/components/text-field';
	import { TrailCard, TrailCardGrid } from '$lib/components/trail-card';
	import { cn } from '$lib/utils/cn.js';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageServerData } from './$types.js';

	export let data: PageServerData;

	const { form, errors, enhance, constraints, submitting } = superForm(data.form, {
		resetForm: true
	});
</script>

<section >
  <SectionHeading>Gerenciar conteúdo</SectionHeading>
	<form
		use:enhance
		enctype="multipart/form-data"
		method="POST"
		action="/"
		class="lc-box flex flex-col gap-2"
	>
		<h2 class="text-2xl font-bold">Criar trilha</h2>

		<TextField
			id="title"
			variant="opaque"
			label="Título"
			name="title"
			type="text"
			errors={$errors.title}
			bind:value={$form.title}
			{...$constraints.title}
		/>

		<TextField
			id="description"
			name="description"
			label="Descrição"
			variant="opaque"
			errors={$errors.description}
			bind:value={$form.description}
			{...$constraints.description}
		/>

		<TextField
			id="thumbnailAlt"
			label="Texto alternativo da imagem"
			name="imageAlt"
			type="text"
			variant="opaque"
			errors={$errors.thumbnailAlt}
			bind:value={$form.thumbnailAlt}
			{...$constraints.thumbnailAlt}
		/>

		<InputFile
			name="thumbnail"
			max={1}
			accept={['image/*']}
			let:droppable
			on:change={(event) => console.log(event.detail.files)}
			on:error={(event) => console.log(event.detail.message)}
		>
			<div
				class={cn(
					'bg-white border border-dashed border-gray-300 rounded-md p-4 text-center',
					droppable && 'border-purple-600'
				)}
			>
				{droppable ? 'Solte o arquivo aqui' : 'Arraste e solte um arquivo aqui ou clique para selecionar'}
			</div>
		</InputFile>

		<Button className="mt-4" loading={$submitting} type="submit">Criar</Button>
	</form>
</section>

{#if data.error}
	<Badge variant="warning" className="mt-4">
		{data.error}
	</Badge>
{/if}

<TrailCardGrid>
	{#each data.trails as trail}
		<TrailCard {trail} editable />
	{/each}
</TrailCardGrid>
