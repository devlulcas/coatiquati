<script lang="ts">
	import { enhance } from '$app/forms';
	import { AdminSection } from '$lib/components/admin-section';
	import { Badge } from '$lib/components/badge';
	import { Button } from '$lib/components/button';
	import { TextField } from '$lib/components/text-field';
	import type { ActionData, PageServerData } from './$types';

	export let data: PageServerData;
	export let form: ActionData;

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

	<form method="POST" use:enhance class="mt-4 flex gap-2 w-full">
		{#if data.user.roles.includes('admin')}
			<Badge variant="warning">
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
			<Badge variant="info">
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

	<form action="?/ban" method="POST" use:enhance class="lc-box mt-4 flex flex-col gap-2 w-full">
		<TextField id="reason" label="Motivo do banimento" name="reason" type="text" variant="opaque" />

		<Badge variant="error">
			Banir usuário ({data.user.banVotes} / 2)
			<Button class="min-w-fit ml-auto hover:bg-white hover:text-red-500" type="submit" variant="ghost">
				{data.user.banVotes === 0 ? 'Iniciar banimento' : 'Confirmar banimento'}
			</Button>
		</Badge>
	</form>

	<div class="flex flex-col gap-2 mt-2">
		{#if form?.data}
			<Badge variant="success">
				{form.data.first.username} iniciou um processo de banimento contra {form.data.target.username}.
			</Badge>

			{#if form.data.second}
				<Badge variant="success">
					{form.data.second.username} confirmou o banimento.
				</Badge>
			{/if}

			{#if form.data.reason}
				<Badge variant="info">
					Motivo: {form.data.reason}
				</Badge>
			{/if}
		{/if}
	</div>
</AdminSection>
