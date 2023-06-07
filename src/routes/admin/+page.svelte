<script lang="ts">
	import { AdminSection } from '$lib/components/admin-section';
	import { Button } from '$lib/components/button';
	import { Input } from '$lib/components/input';
	import { UserCard } from '$lib/components/user-card';
	import { RotateCcw, Search } from 'lucide-svelte';
	import type { PageServerData } from './$types';
	import { fly } from 'svelte/transition';

	export let data: PageServerData;

	const stats = [
		{ label: 'Trilhas', value: 23 },
		{ label: 'Usuários', value: 2000 },
		{ label: 'Administradores', value: 12 },
		{ label: 'Categorias', value: 6 }
	];
</script>

<AdminSection title="Membros">
	<form
		method="GET"
		action="/admin"
		data-sveltekit-keepfocus
		class="lc-box flex gap-2 my-4 items-end"
	>
		<Input
			placeholder="Buscar por nome"
			variant="opaque"
			id="username"
			label="Nome de usuário"
			name="username"
			type="text"
			containerClassname="flex-1"
		/>

		<label class="p-2 text-md flex gap-2 accent-purple-800">
			<input type="radio" id="role" name="role" value="USER" />
			<span>Usuário</span>
		</label>

		<label class="p-2 text-md flex gap-2 accent-purple-800">
			<input type="radio" id="role" name="role" value="ADMIN" />
			<span> Moderador </span>
		</label>

		<Button data-sveltekit-keepfocus href="/admin" variant="secondary">
			Limpar
			<RotateCcw size={18} />
		</Button>

		<Button type="submit">
			Buscar
			<Search size={18} />
		</Button>
	</form>

	{#if data.users}
		<ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
			{#each data.users as user}
				<li in:fly={{ duration: 300, x: 50 }} out:fly={{ duration: 300, x: 50 }}>
					<UserCard {user} isCurrentUser={user.id === data.currentUser.id} />
				</li>
			{/each}
		</ul>
	{/if}
</AdminSection>

<AdminSection title="Gerenciar conteúdo">
	<nav class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2" aria-label="Gerenciar conteúdo">
		<a class="lc-box flex items-center justify-center w-fill aspect-square" href="/trails">
			Gerenciar trilhas
		</a>
		<a class="lc-box flex items-center justify-center w-fill aspect-square" href="/categories">
			Gerenciar categorias
		</a>
		<a class="lc-box flex items-center justify-center w-fill aspect-square" href="/seo">
			Gerenciar página - CEO
		</a>
	</nav>
</AdminSection>

<AdminSection title="Estátisticas">
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
		<div class="grid grid-cols-2 gap-2">
			{#each stats as stat}
				<article class="lc-box aspect-square flex flex-col">
					<h3 class="text-xl font-bold truncate">{stat.label}</h3>
					<p class="text-3xl font-bold self-end mt-auto">{stat.value}</p>
				</article>
			{/each}
		</div>
	</div>

	<a class="lc-box mt-2 flex items-center justify-center w-fill" href="/logs?page=2">Ver mais</a>
</AdminSection>
