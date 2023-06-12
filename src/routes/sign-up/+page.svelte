<script lang="ts">
	import { enhance } from '$app/forms';
	import { Badge } from '$lib/components/badge';
	import { Button } from '$lib/components/button';
	import { InputContainer } from '$lib/components/input-container';
	import { SignInWithGoogle } from '$lib/components/sign-in-with-google';

	export let form: { message?: string };
</script>

<div class="flex flex-col items-center justify-center text-white h-[--safe-screen-height]">
	<SignInWithGoogle />

	<p class="m-2">ou</p>
	<div class="min-w-[300px] max-w-3xl">
		<form
			class="border px-8 py-10 w-full flex flex-col gap-4 bg-white/10 rounded-md"
			method="post"
			use:enhance
		>
			<div class="flex flex-col lg:flex-row gap-2">
				<InputContainer let:inputClassName label="Nome de usuário" id="username">
					<input class={inputClassName} type="text" id="username" name="username" />
				</InputContainer>

				<InputContainer let:inputClassName label="Nome" id="name">
					<input class={inputClassName} type="text" id="name" name="name" />
				</InputContainer>
			</div>

			<InputContainer let:inputClassName label="E-mail" id="email">
				<input class={inputClassName} type="email" id="email" name="email" />
			</InputContainer>

			<InputContainer let:inputClassName label="Senha" id="password">
				<input class={inputClassName} type="password" id="password" name="password" />
			</InputContainer>

			<Button type="submit">Entrar</Button>
		</form>

		{#if form}
			<Badge variant="error" class="mt-4">
				{form.message}
			</Badge>
		{/if}
	</div>

	<a href="/sign-in" class="mt-10">Já possui uma conta? Entre clicando aqui</a>
</div>
