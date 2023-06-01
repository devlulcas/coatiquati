<script lang="ts">
	import { AdminSection } from '$lib/components/admin-section';
	import { Button } from '$lib/components/button';
	import { Input } from '$lib/components/input';
	import { UserCard } from '$lib/components/user-card';
	import { RotateCcw, Search } from 'lucide-svelte';
	import type { PageServerData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';

	export let data: PageServerData;

	const { form, errors, constraints, enhance, submitting, reset } = superForm(data.form);
</script>

<AdminSection title="Membros">
	<form method="GET" action="?/" use:enhance class="lc-box flex gap-2 my-4 items-end">
		<Input
			errors={$errors.username}
			placeholder="Buscar por nome"
			variant="opaque"
			id="username"
			label="Nome de usuário"
			name="username"
			type="text"
			containerClassname="flex-1"
			bind:value={$form.username}
			{...$constraints.username}
		/>

		<label class="p-2 text-md flex gap-2 accent-purple-800">
			<input type="radio" id="role" name="role" value="USER" />
			<span>Usuário</span>
		</label>

		<label class="p-2 text-md flex gap-2 accent-purple-800">
			<input type="radio" id="role" name="role" value="ADMIN" />
			<span> Moderador </span>
		</label>

		<Button variant="secondary" on:click={() => reset()} disabled={$submitting} type="reset">
			Limpar
			<RotateCcw size={18} />
		</Button>

		<Button variant="primary" type="submit">
			{#if $submitting}
				Buscando...
			{:else}
				Buscar
			{/if}

			<Search size={18} />
		</Button>
	</form>

	{#if data.users}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
			{#each data.users as user}
				<UserCard {user} isCurrentUser={user.id === data.currentUser.id} />
			{/each}
		</div>
	{/if}
</AdminSection>

<AdminSection title="Gerenciar conteúdo">
	<form class="lc-box flex flex-col gap-4" method="POST" action="/createTrail">
		<h2 class="text-2xl font-bold">Criar trilha</h2>
		<Input variant="opaque" id="title" label="Título" name="title" />
		<Input variant="opaque" id="description" label="Descrição" name="description" />
		<Input variant="opaque" id="image" label="Imagem" name="image" />
		<Button type="submit">Criar</Button>
	</form>
</AdminSection>
