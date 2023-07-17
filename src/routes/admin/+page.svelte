<script lang="ts">
	import { Badge } from '$lib/components/badge';
	import { Button } from '$lib/components/button';
	import { SectionHeading } from '$lib/components/heading';
	import { RadioButton } from '$lib/components/radio-button';
	import { TextField } from '$lib/components/text-field';
	import { UserCard } from '$lib/components/user-card';
	import { Boxes, Footprints, Layout, RotateCcw, Search } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import type { PageData } from './$types';

	export let data: PageData;

	const stats = [
		{ label: 'Trilhas', value: 23 },
		{ label: 'Usuários', value: 2000 },
		{ label: 'Administradores', value: 12 },
		{ label: 'Categorias', value: 6 }
	];
</script>

<section>
  <SectionHeading>Membros</SectionHeading>
	<form method="GET" action="/admin" data-sveltekit-keepfocus class="lc-box mb-2">
		<TextField
			id="username"
			variant="opaque"
			label="Nome de usuário"
			name="username"
			type="text"
			placeholder="Buscar por nome"
		/>
		<div class="flex gap-2 mt-2">
			<RadioButton name="role" id="role-user" value="USER" label="Usuário" />
			<RadioButton name="role" id="role-admin" value="ADMIN" label="Moderador" />
			<Button icon={RotateCcw} type="reset" variant="secondary">Limpar</Button>
			<Button type="submit">
				Buscar
				<Search size={18} />
			</Button>
		</div>
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
	{#if data.users.length === 0}
		<Badge variant="warning">Nenhum usuário encontrado</Badge>
	{/if}
</section>

<section >
  <SectionHeading>Gerenciar conteúdo</SectionHeading>
	<nav class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2" aria-label="Gerenciar conteúdo">
		<a class="lc-box flex flex-col gap-2 items-center justify-center w-fill aspect-square" href="/admin/trails">
			Gerenciar trilhas
			<Footprints size={48} />
		</a>
		<a class="lc-box flex flex-col gap-2 items-center justify-center w-fill aspect-square" href="/admin/categories">
			Gerenciar categorias
			<Boxes size={48} />
		</a>
		<a class="lc-box flex flex-col gap-2 items-center justify-center w-fill aspect-square" href="/admin/seo">
			Gerenciar página - CEO
			<Layout size={48} />
		</a>
	</nav>
</section>

<section >
  <SectionHeading>Estátisticas</SectionHeading>
	<div class="grid grid-cols-1 md:grid-cols-3 gap-2">
		<div class="grid grid-cols-2 gap-2">
			{#each stats as stat}
				<article class="lc-box aspect-square flex flex-col">
					<h3 class="text-xl font-bold truncate">{stat.label}</h3>
					<p class="text-3xl font-bold self-end mt-auto">{stat.value}</p>
				</article>
			{/each}
		</div>
		<div class="lc-box flex flex-col col-span-2">
			<h3 class="text-xl font-bold truncate">Últimos usuários</h3>
			<ul class="flex flex-col gap-2 mt-2">
				{#each data.users.slice(0, 5) as user}
					<li class="flex gap-2">
						<span>{user.username}</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>
	<a class="lc-box mt-2 flex items-center justify-center w-fill" href="/logs?page=2">Ver mais</a>
</section>
