<script lang="ts">
	import { enhance } from '$app/forms';
	import { Roles, userRolesHasRole } from '$modules/user/constants/user-roles';
	import type { User } from '$modules/user/entities/user.entity';
	import { BrainIcon } from 'lucide-svelte';
	import Dialog from './dialog.svelte';
	import NavItem from './nav-item.svelte';

	export let user: User | null = null;
</script>

<header
	class="sticky top-0 z-10 bg-black/25 text-white h-[var(--header-height)] border-b-[1px] border-white/10 backdrop-blur-md flex items-center justify-between p-2"
>
	<a title="coati" href="/">
		<BrainIcon class="w-8 h-8 text-white/80 fill-white" />
	</a>

	<Dialog>
		<nav class="flex flex-col gap-4">
			<NavItem href="/trails">Conhecer trilhas</NavItem>

			{#if user && userRolesHasRole(Roles.ADMIN, user.roles)}
				<NavItem href="/admin">Painel administrativo</NavItem>
			{/if}

			{#if user}
				<NavItem href="/profile">Olá {user.username}</NavItem>

				<form use:enhance method="post" action="/api/sign-out">
					<NavItem>Sair</NavItem>
				</form>
			{:else}
				<NavItem href="/sign-in">Entrar</NavItem>
			{/if}
		</nav>
	</Dialog>

	<nav class="hidden md:flex items-center gap-4">
		<a href="/trails" class="p-2">Conhecer trilhas</a>

		{#if user}
			<form use:enhance method="POST" action="/sign-out">
				<button type="submit">Sair</button>
			</form>

			<a href="/profile" class="p-2">Olá {user.username}</a>

			{#if userRolesHasRole(Roles.ADMIN, user.roles)}
				<a href="/admin" class="p-2">Painel administrativo</a>
			{/if}
		{:else}
			<a href="/sign-in" class="p-2">Entrar</a>
		{/if}
	</nav>
</header>
