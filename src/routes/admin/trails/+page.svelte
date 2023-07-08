<script lang="ts">
	import { AdminSection } from '$lib/components/admin-section';
	import { Badge } from '$lib/components/badge';
	import { Button } from '$lib/components/button';
	import { InputImage } from '$lib/components/input-file';
	import { TextField } from '$lib/components/text-field';
	import { TrailCard } from '$lib/components/trail-card';
	import { superForm } from 'sveltekit-superforms/client';
	import type { ActionData, PageServerData } from './$types.js';

	export let data: PageServerData;

	export let form: ActionData;

	const {
		form: sForm,
		errors,
		enhance,
		constraints,
		submitting
	} = superForm(data.form, {
		resetForm: true
	});
</script>

<AdminSection title="Gerenciar conteúdo">
	<form
		use:enhance
		enctype="multipart/form-data"
		method="POST"
		action="?/createTrail"
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
			bind:value={$sForm.title}
			{...$constraints.title}
		/>

		<TextField
			id="description"
			name="description"
			label="Descrição"
			variant="opaque"
			errors={$errors.description}
			bind:value={$sForm.description}
			{...$constraints.description}
		/>

		<TextField
			id="thumbnailAlt"
			label="Texto alternativo da imagem"
			name="imageAlt"
			type="text"
			variant="opaque"
			errors={$errors.thumbnailAlt}
			bind:value={$sForm.thumbnailAlt}
			{...$constraints.thumbnailAlt}
		/>

		<InputImage errors={form?.thumbnailUploadError} />

		<Button loading={$submitting} type="submit">Criar</Button>
	</form>
</AdminSection>

{#if data.error}
	<Badge variant="warning" class="mt-4">
		{data.error}
	</Badge>
{/if}

<div class="grid grid-cols-1 gap-4 mt-8 lg:grid-cols-2">
	{#each data.trails as trail}
		<TrailCard {trail} editable />
	{/each}
</div>
