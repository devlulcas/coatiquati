<script lang="ts">
	import { Badge } from '$lib/components/badge/';
	import { Button } from '$lib/components/button';
	import { SignInWithGoogle } from '$lib/components/sign-in-with-google';
	import { TextField } from '$lib/components/text-field';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;

	const { form, errors, enhance, message, constraints, submitting } = superForm(data.form, {
		validationMethod: 'onblur'
	});
</script>

<div class="flex flex-col items-center justify-center text-white h-[--safe-screen-height]">
	<SignInWithGoogle />

	<p class="m-2">ou</p>

	<div class="min-w-[300px] max-w-3xl">
		<form class="border px-8 py-10 w-full flex flex-col gap-2 bg-white/25 rounded-md" method="post" use:enhance>
			<div class="flex flex-col lg:flex-row gap-2">
				<TextField
					id="username"
					name="username"
					label="Nome de usuário"
					type="text"
					bind:value={$form.username}
					errors={$errors.username}
					{...$constraints.username}
				/>

				<TextField
					id="name"
					name="name"
					label="Nome"
					type="text"
					bind:value={$form.name}
					errors={$errors.name}
					{...$constraints.name}
				/>
			</div>

			<TextField
				id="email"
				name="email"
				label="E-mail"
				type="email"
				bind:value={$form.email}
				errors={$errors.email}
				{...$constraints.email}
			/>

			<TextField
				id="password"
				name="password"
				label="Senha"
				type="password"
				bind:value={$form.password}
				errors={$errors.password}
				{...$constraints.password}
				showVisibilityButton
			/>

			<Button type="submit" loading={$submitting}>Entrar</Button>
		</form>

		{#if $message}
			<Badge variant="error" class="mt-4">
				{$message}
			</Badge>
		{/if}
	</div>

	<a href="/sign-in" class="mt-10">Já possui uma conta? Entre clicando aqui</a>
</div>
