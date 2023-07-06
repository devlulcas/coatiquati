<script lang="ts">
	import { Badge } from '$lib/components/badge/index.js';
	import { Button } from '$lib/components/button';
	import { InputContainer } from '$lib/components/input-container';
	import { SignInWithGoogle } from '$lib/components/sign-in-with-google';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	const { form, errors, enhance, message, constraints, submitting } = superForm(data.form);
</script>

<div class="flex flex-col items-center justify-center text-white h-[--safe-screen-height]">
	<SignInWithGoogle />

	<p class="m-2">ou</p>
	<div class="min-w-[300px] max-w-3xl">
		<form class="border px-8 py-10 w-full flex flex-col gap-4 bg-white/10 rounded-md" method="post" use:enhance>
			<div class="flex flex-col lg:flex-row gap-2">
				<InputContainer errors={$errors.username} let:inputClassName label="Nome de usuário" id="username">
					<input
						{...$constraints.username}
						bind:value={$form.username}
						class={inputClassName}
						type="text"
						id="username"
						name="username"
					/>
				</InputContainer>

				<InputContainer errors={$errors.name} let:inputClassName label="Nome" id="name">
					<input
						{...$constraints.name}
						bind:value={$form.name}
						class={inputClassName}
						type="text"
						id="name"
						name="name"
					/>
				</InputContainer>
			</div>

			<InputContainer errors={$errors.email} let:inputClassName label="E-mail" id="email">
				<input
					{...$constraints.email}
					bind:value={$form.email}
					class={inputClassName}
					type="email"
					id="email"
					name="email"
				/>
			</InputContainer>

			<InputContainer errors={$errors.password} let:inputClassName label="Senha" id="password">
				<input
					{...$constraints.password}
					bind:value={$form.password}
					class={inputClassName}
					type="password"
					id="password"
					name="password"
				/>
			</InputContainer>

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
