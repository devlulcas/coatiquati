<script lang="ts">
	import { AdminSection } from '$lib/components/admin-section';
	import { Button } from '$lib/components/button';
	import { Input } from '$lib/components/input';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<form method="GET" action="/?listUsers" class="flex gap-2 w-1/2 min-w-[300px] mx-auto my-4">
	<input
		type="text"
		name="search"
		placeholder="Buscar usuário"
		class="border-[1px] border-white/25 rounded-md p-2 m-2 w-full bg-white text-black"
	/>

	<button type="submit" class="border-[1px] border-white/25 rounded-md p-2 m-2">Buscar</button>
</form>

{#if data.admins}
	<AdminSection title="Membros administradores">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
			{#each data.admins as admin}
				<div
					class="flex flex-col gap-2 border-[1px] border-white/25 bg-black/25 rounded-md p-4 m-2"
				>
					<h3 class="text-xl font-bold">@{admin.username}</h3>
					<p>{admin.name}</p>
					<p>{admin.email}</p>
					<p class="flex gap-1">
						{#each admin.roles as role}
							<strong
								class:bg-purple-700={role === 'ADMIN'}
								class:bg-fuchsia-700={role === 'USER'}
								class="text-sm px-2 py-1 rounded-sm"
							>
								{role}
							</strong>
						{/each}
					</p>
				</div>
			{/each}
		</div>
	</AdminSection>
{/if}

<AdminSection title="Gerenciar conteúdo">
	<div class="flex flex-col gap-4 border-[1px] border-white/25 rounded-md p-4 m-2">
		<form class="flex flex-col gap-4 p-2" method="POST" action="/createTrail">
			<h2 class="text-2xl font-bold">Criar trilha</h2>

			<Input id="title" label="Título" name="title" />
			<Input id="description" label="Descrição" name="description" />
			<Input id="image" label="Imagem" name="image" />

			<Button type="submit">Criar</Button>
		</form>
	</div>
</AdminSection>
