<script lang="ts">
	import { AdminSection } from '$lib/components/admin-section';
	import { Badge } from '$lib/components/badge/index.js';
	import { Button } from '$lib/components/button';
	import { InputContainer } from '$lib/components/input-container';
	import InputImage from '$lib/components/input-file/input-image.svelte';
	import { TrailCard } from '$lib/components/trail-card';
	import { cn } from '$lib/utils/cn';
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
		class="lc-box flex flex-col gap-4"
	>
		<h2 class="text-2xl font-bold">Criar trilha</h2>

		<InputContainer errors={$errors.title} id="title" let:inputClassName variant="opaque" label="Título">
			<input
				{...$constraints.title}
				bind:value={$sForm.title}
				id="title"
				class={inputClassName}
				name="title"
				type="text"
			/>
		</InputContainer>

		<InputContainer errors={$errors.description} let:inputClassName id="description" variant="opaque" label="Descrição">
			<textarea
				{...$constraints.description}
				bind:value={$sForm.description}
				id="description"
				class={cn(inputClassName, 'resize-none')}
				name="description"
				rows={3}
			/>
		</InputContainer>

		<InputContainer
			errors={$errors.thumbnailAlt}
			let:inputClassName
			id="thumbnailAlt"
			variant="opaque"
			label="Texto alternativo da imagem"
		>
			<input
				{...$constraints.thumbnailAlt}
				bind:value={$sForm.thumbnailAlt}
				id="imageAlt"
				class={inputClassName}
				name="imageAlt"
				type="text"
			/>
		</InputContainer>

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
