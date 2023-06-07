<script lang="ts">
	import { AdminSection } from '$lib/components/admin-section';
	import { Button } from '$lib/components/button';
	import { Input } from '$lib/components/input';
	import { UserCard } from '$lib/components/user-card';
	import { RotateCcw, Search } from 'lucide-svelte';
	import type { PageServerData } from './$types';
	import { fly } from 'svelte/transition';

	export let data: PageServerData;
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
	<form class="lc-box flex flex-col gap-4" method="POST" action="/createTrail">
		<h2 class="text-2xl font-bold">Criar trilha</h2>
		<Input variant="opaque" id="title" label="Título" name="title" />
		<Input variant="opaque" id="description" label="Descrição" name="description" />
		<Input variant="opaque" id="image" label="Imagem" name="image" />
		<Button type="submit">Criar</Button>
	</form>
</AdminSection>
