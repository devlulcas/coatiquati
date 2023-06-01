<script lang="ts">
	import { userRolesHasRole } from '$src/modules/user/constants/user-roles';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	const hat = userRolesHasRole('ADMIN', data.user?.roles) ? 'hat-fedora' : 'winter-hat';
</script>

<main class="p-10 bg-black/25 text-white">
	<div class="flex gap-2">
		<picture class="relative">
			<img
				class="w-14 h-14 absolute -top-9 rotate-[30deg] -right-4 invert"
				src={hat + '.svg'}
				alt={hat}
			/>

			<img
				class="w-24 h-24 rounded-full"
				src={'https://api.dicebear.com/6.x/notionists-neutral/svg' + '?seed=' + data.user?.id}
				alt={data.user?.username}
			/>
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
