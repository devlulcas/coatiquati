<script lang="ts">
	import { TrailCard } from '$lib/trail-card';
	import type { PageServerData } from './$types';
	import { Map, Search } from 'lucide-svelte';

	export let data: PageServerData;
</script>

<main class="mx-auto">
	<h1 class="flex items-center gap-2 text-2xl font-bold text-gray-900 my-4">
		<Map />
		<span>Trilhas</span>
	</h1>

	<form class="flex items-center gap-2 mb-4">
		<input
			class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-gray-500 focus:border-gray-500"
			type="text"
			placeholder="Pesquisar"
		/>

		<button
			class="px-4 py-2 bg-gray-900 text-white rounded-lg shadow-sm focus:ring-gray-500 focus:border-gray-500"
			type="submit"
		>
			<Search />
		</button>
	</form>

	<ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
		{#each data.trails as trail}
			<li>
				<TrailCard data={trail} />
			</li>
		{/each}
	</ul>
</main>
