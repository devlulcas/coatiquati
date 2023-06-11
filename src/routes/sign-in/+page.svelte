<script lang="ts">
	import { enhance } from '$app/forms';
	import Badge from '$lib/components/badge/badge.svelte';
	import Button from '$lib/components/button/button.svelte';
	import Input from '$lib/components/input/input.svelte';
	import SignInWithGoogle from '$lib/components/sign-in-with-google/sign-in-with-google.svelte';
	import type { PageServerData } from './$types';

	export let form: { message?: string };
	export let data: PageServerData;
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

		<form
			class="border-[1px] px-8 py-10 w-full flex flex-col gap-4 bg-white/10 rounded-md"
			method="post"
			use:enhance
		>
			<Input type="text" label="Nome de usuário" id="username" name="username" />
			<Input type="password" label="Senha" id="password" name="password" />

			<Button type="submit">Entrar</Button>
		</form>

		{#if form?.message}
			<Badge variant="error" class="mt-4">
				{form.message}
			</Badge>
		{/if}
	</div>

	<a href="/sign-up" class="mt-10">Ainda não tem uma conta? Se cadastre clicando aqui</a>
</div>
