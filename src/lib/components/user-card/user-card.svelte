<script lang="ts">
	import type { AuthUser } from '$modules/user/schemas/auth-user';
	import { Edit } from 'lucide-svelte';
	import { RoleBadge } from '../badge';
	import { Divider } from '../divider';

	export let user: AuthUser;
	export let isCurrentUser = false;
</script>

<div
	class="lc-box relative flex flex-col gap-2 border-2 border-white/25 bg-black/25 rounded-md p-4 break-words"
	class:border-emerald-300={isCurrentUser}
>
	<div class="flex gap-2 items-center justify-between">
		<h3 class="text-xl font-bold">@{user.username}</h3>

		{#if isCurrentUser}
			<a
				href="/profile"
				title="Esse é você! Clique para editar seu perfil"
				class="p-2 rounded-md bg-emerald-500 bg-opacity-25 text-emerald-800 hover:bg-opacity-50"
			>
				<Edit size={18} />
			</a>
		{:else}
			<a
				href={`/admin/users/${user.id}`}
				title="Editar usuário"
				class="p-2 rounded-md bg-purple-500 bg-opacity-25 text-purple-800 hover:bg-opacity-50"
			>
				<Edit size={18} />
			</a>
		{/if}
	</div>

	<Divider spaceY={2} />

	<p>{user.name}</p>

	<p title={user.email} class="truncate">{user.email}</p>

	<p class="flex gap-1 self-end">
		{#each user.roles as role}
			<RoleBadge {role} />
		{/each}
	</p>
</div>
