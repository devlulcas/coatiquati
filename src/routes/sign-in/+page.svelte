<script lang="ts">
	import { Badge } from '$lib/components/badge';
	import { Button } from '$lib/components/button';
	import { InputContainer } from '$lib/components/input-container';
	import { SignInWithGoogle } from '$lib/components/sign-in-with-google';
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
			<Badge variant="warning" class="mb-4 ">
				{data.redirectData.reasonMessage}
			</Badge>
		{/if}

		<form class="border px-8 py-10 w-full flex flex-col gap-4 bg-white/10 rounded-md" method="post" use:enhance>
			<InputContainer let:inputClassName label="Nome de usuário" id="username">
				<input
					bind:value={$form.username}
					class={inputClassName}
					type="text"
					name="username"
					id="username"
					{...$constraints.username}
				/>
			</InputContainer>

			<InputContainer let:inputClassName label="Senha" id="password">
				<input
					bind:value={$form.password}
					class={inputClassName}
					type="password"
					name="password"
					id="password"
					{...$constraints.password}
				/>
			</InputContainer>

			<Button loading={$submitting} type="submit">Entrar</Button>
		</form>

		{#if $message}
			<Badge variant="error" class="mt-4">
				{$message}
			</Badge>
		{/if}
	</div>

	<a href="/sign-up" class="mt-10">Ainda não tem uma conta? Se cadastre clicando aqui</a>
</div>
