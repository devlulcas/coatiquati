<script lang="ts">
	import { enhance } from '$app/forms';
	import Badge from '$lib/components/badge/badge.svelte';
	import Button from '$lib/components/button/button.svelte';
	import Input from '$lib/components/input/input.svelte';
	import SignInWithGoogle from '$lib/components/sign-in-with-google/sign-in-with-google.svelte';

	export let form: { message?: string };
</script>

<div class="flex flex-col items-center justify-center text-white h-[--safe-screen-height]">
	<SignInWithGoogle />

	<p class="m-2">ou</p>

	<form
		class="border-[1px] px-8 py-10 min-w-[300px] max-w-3xl flex flex-col gap-4 bg-white/10 rounded-md"
		method="post"
		use:enhance
	>
		<Input type="text" label="Nome de usuário" id="username" name="username" />
		<Input type="password" label="Senha" id="password" name="password" />

		<Button type="submit">Entrar</Button>
	</form>

	{#if form?.message}
		<Badge>
			{form.message}
		</Badge>
	{/if}

	<a href="/sign-up" class="mt-10">Ainda não tem uma conta? Se cadastre clicando aqui</a>
</div>
