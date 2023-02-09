<script lang="ts">
	import BreadcrumbFloatingPanel from '$lib/BreadcrumbFloatingPanel.svelte';
	import TrailTopicCard from '$lib/TrailTopicCard.svelte';
	import { Pin } from 'lucide-svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<main class="container mx-auto">
	<div class="flex gap-2">
		<div class="md:w-1/2">
			<h1 class="flex items-center gap-2 text-2xl font-bold text-gray-900 my-4">
				<Pin />
				<span>Trilhas</span>
			</h1>

			<ul class="flex flex-col">
				{#each data.breadcrumbs as breadcrumb}
					<TrailTopicCard {breadcrumb} trailSlug={data.trail.slug} />
				{/each}
			</ul>
		</div>

		<div class="hidden md:block w-1/2 relative">
			<BreadcrumbFloatingPanel trail={data.trail} breadcrumb={data.breadcrumbs[0]} />
		</div>
	</div>
</main>
