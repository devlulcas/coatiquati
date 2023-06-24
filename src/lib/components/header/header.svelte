<script lang="ts">
	import { enhance } from '$app/forms';
	import { Roles, userRolesHasRole } from '$modules/user/constants/user-roles';
	import type { User } from '$modules/user/entities/user.entity';
	import { BrainIcon } from 'lucide-svelte';

	export let user: User | null = null;

	let dialog: HTMLDialogElement;

	function backdropClick(event: MouseEvent) {
		event.target === dialog && closeModal();
	}

	function closeModal() {
		dialog.close();

		dialog.removeEventListener('click', backdropClick);
	}

	function openModal() {
		dialog.showModal();

		dialog.addEventListener('click', backdropClick);
	}
</script>

<header
	class="sticky top-0 z-10 bg-black/25 text-white h-[var(--header-height)] border-b-[1px] border-white/10 backdrop-blur-md flex items-center justify-between p-2"
>
	<a title="coati" href="/">
		<BrainIcon class="w-8 h-8 text-white/80 fill-white" />
	</a>

	<button on:click={openModal} class="block md:hidden">
		<span class="sr-only">Abrir menu</span>

		<span class="block w-6 h-[2px] bg-white/50 rounded-full mb-1" />
		<span class="block w-6 h-[2px] bg-white/50 rounded-full mb-1" />
		<span class="block w-6 h-[2px] bg-white/50 rounded-full mb-1" />
	</button>

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

<dialog bind:this={dialog}>
	<nav class="flex flex-col gap-2">
		<a href="/trails" class="nav-item">Conhecer trilhas</a>

		{#if user && userRolesHasRole(Roles.ADMIN, user.roles)}
			<a href="/admin" class="nav-item">Painel administrativo</a>
		{/if}

		{#if user}
			<a href="/profile" class="nav-item">Olá {user.username}</a>

			<form use:enhance method="post" action="/api/sign-out">
				<button class="nav-item" type="submit">Sair</button>
			</form>
		{:else}
			<a href="/sign-in" class="nav-item">Entrar</a>
		{/if}
	</nav>
</dialog>

<style lang="postcss">
	@keyframes fade-in {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

	.nav-item {
		padding: 0.75rem 1rem;
		max-width: 100%;
		text-align: start;
		border-radius: 5px;
		color: hsl(0deg 0% 100% / 0.9);
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		border: 1px solid hsl(0deg 0% 95% / 0.15);
	}

	dialog {
		border: 1px solid hsl(0deg 0% 95% / 0.15);
		border-radius: 5px;
		background-color: hsl(0deg 0% 0% / 0.5);
		margin-bottom: 5%;
		animation: fade-in 0.5s ease-in-out;
	}

	::backdrop {
		animation: fade-in 0.3s ease-in-out;
		backdrop-filter: blur(10px);
		background-color: rgba(0, 0, 0, 0.779);
	}
</style>
