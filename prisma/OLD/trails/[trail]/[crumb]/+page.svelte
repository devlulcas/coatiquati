<script lang="ts">
	import { Pin } from 'lucide-svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<main class="container mx-auto">
	<h1 class="flex items-center gap-2 text-2xl font-bold text-gray-900 my-4">
		<Pin />
		<span>{data.trail?.title} - {data.breadcrumb?.title}</span>
	</h1>

	<p>
		{data.breadcrumb?.description}
	</p>
  
</main>
