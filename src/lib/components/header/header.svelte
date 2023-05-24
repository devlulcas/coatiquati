<script>
	import { enhance } from '$app/forms';
	import { BrainIcon } from 'lucide-svelte';

	export let isLoggedIn = false;
</script>

<header
	class="vh-[var(--header-height)] border-b-[1px] border-white/10 backdrop-blur-md flex items-center justify-between p-2"
>
	<a title="coati" href="/">
		<BrainIcon class="w-8 h-8 text-white/80 fill-white" />
	</a>

	<nav class="flex items-center gap-4">
		<a href="/trails" class="p-2">Conhecer trilhas</a>

		{#if isLoggedIn}
			<form use:enhance method="post" action="/api/sign-out">
				<button type="submit">Sair</button>
			</form>

			<a href="/profile" class="p-2">Perfil</a>
		{:else}
			<a href="/sign-in" class="p-2">Entrar</a>
		{/if}
	</nav>
</header>
