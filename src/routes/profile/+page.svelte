<script lang="ts">
	import { isAdministrator } from '$modules/user/constants/user-roles';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	const hat = isAdministrator(data.user?.roles) ? 'hat-fedora' : null;
</script>

<main class="p-10 bg-black/25 text-white">
	<div class="flex gap-2">
		<picture class="relative">
			{#if hat}
				<img class="w-14 h-14 absolute -top-9 rotate-[30deg] -right-4 invert" src={hat + '.svg'} alt={hat} />
			{/if}

			<img width={96} height={96} class="w-24 h-24 rounded-full" src={data.user.avatar} alt={data.user.username} />
		</picture>

		<div class="flex flex-col gap-2 justify-center">
			<div class="flex gap-2">
				<h2 class="text-2xl font-bold">Perfil de {data.user?.username}</h2>
				<p class="text-md font-bold text-neutral-300">
					({data.user?.name})
				</p>
			</div>

			<p class="text-md font-bold text-neutral-300">
				{data.user?.email}
			</p>
		</div>
	</div>
</main>
