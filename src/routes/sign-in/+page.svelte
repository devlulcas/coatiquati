<script lang="ts">
	import { Badge } from '$lib/components/badge';
	import { Button } from '$lib/components/button';
	import { SignInWithGoogle } from '$lib/components/sign-in-with-google';
	import { TextField } from '$lib/components/text-field';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	const { enhance, form, message, constraints, submitting } = superForm(data.form);
</script>

<div class="flex flex-col items-center justify-center text-white h-[--safe-screen-height]">
	<SignInWithGoogle />

	<p class="m-2">ou</p>

	<div class="min-w-[300px] max-w-3xl">
		{#if data.redirectData}
			<Badge variant="warning" className="mb-4 ">
				{data.redirectData.reasonMessage}
			</Badge>
		{/if}

		<form class="border px-8 py-10 w-full flex flex-col gap-4 bg-white/10 rounded-md" method="post" use:enhance>
			<TextField
				id="username"
				name="username"
				label="Nome de usuário"
				type="text"
				bind:value={$form.username}
				{...$constraints.username}
			/>

			<TextField
				id="password"
				name="password"
				type="password"
				label="Senha"
				showVisibilityButton
				bind:value={$form.password}
				{...$constraints.password}
			/>

			<Button loading={$submitting} type="submit">Entrar</Button>
		</form>

		{#if $message}
			<Badge variant="error" className="mt-4">
				{$message}
			</Badge>
		{/if}
	</div>

	<a href="/sign-up" class="mt-10">Ainda não tem uma conta? Se cadastre clicando aqui</a>
</div>
