<script lang="ts">
	import { Badge } from '$lib/components/badge';
	import { Button } from '$lib/components/button';
	import { SectionHeading } from '$lib/components/heading';
	import { TextField } from '$lib/components/text-field';
	import { TrailCard } from '$lib/components/trail-card';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageServerData } from './$types.js';

	export let data: PageServerData;

	const { form, errors, enhance, constraints, submitting, message } = superForm(data.form, {
		resetForm: true
	});
</script>

<section >
  <SectionHeading>Atualizar trilha: {data.trail.title}</SectionHeading>

	<form
		use:enhance
		enctype="multipart/form-data"
		method="POST"
		action="/"
		class="lc-box flex flex-col gap-2"
	>
		<h2 class="text-2xl font-bold">Atualizar trilha</h2>

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

		<Button className="mt-4" loading={$submitting} type="submit">Atualizar</Button>
	</form>
  
  {#if $message}
    <Badge variant="warning" className="mt-4">
      {$message}
    </Badge>
  {/if}
</section>

<TrailCard trail={data.trail}/>

