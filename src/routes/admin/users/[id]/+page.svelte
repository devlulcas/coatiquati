<script lang="ts">
	import { AdminSection } from '$lib/components/admin-section';
	import { Badge } from '$lib/components/badge';
	import { Button } from '$lib/components/button';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	const intl = new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' });
</script>

<AdminSection title={data.user.username}>
	<main class="lc-box flex flex-col gap-4">
		<p>
			<span>Nome:</span>
			<strong>
				{data.user.name}
			</strong>
		</p>

		<p>
			<span>Email:</span>
			<strong>
				{data.user.email}
			</strong>
		</p>

		<p>
			<span>Username:</span>
			<strong>
				{data.user.username}
			</strong>
		</p>

		<p>
			<span>Roles:</span>
			<strong>
				{intl.format(data.user.roles)}
			</strong>
		</p>
	</main>

	<form method="POST" class="mt-4 flex gap-2 w-full">
		{#if data.user.roles.includes('admin')}
			<Badge is="warning">
				Atenção: este usuário é um administrador e tem acesso a todas as funcionalidades do sistema.
				<Button
					class="min-w-fit ml-auto hover:bg-white hover:text-orange-500"
					type="submit"
					formaction="?/downgrade"
					variant="ghost"
				>
					Revogar permissões
				</Button>
			</Badge>
		{:else}
			<Badge is="info">
				Atenção: usuário sem permissões de administrador.
				<Button
					class="min-w-fit ml-auto hover:bg-white hover:text-blue-500"
					type="submit"
					formaction="?/upgrade"
					variant="ghost"
				>
					Tornar administrador
				</Button>
			</Badge>
		{/if}
	</form>
</AdminSection>
