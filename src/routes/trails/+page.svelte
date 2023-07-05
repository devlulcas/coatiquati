<script lang="ts">
	import { Badge } from '$lib/components/badge/index.js';
	import { SimpleFooter } from '$lib/components/footer';
	import { TrailCard } from '$lib/components/trail-card';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="lc-wrapper min-h-[--safe-screen-height]">
	{#if data.error}
		<Badge variant="warning" class="mt-4">
			{data.error}
		</Badge>
	{/if}

	<div class="grid place-items-center grid-cols-1 gap-4 mt-8 lg:grid-cols-2">
		{#each data.trails as trail}
			<TrailCard {trail} />
		{/each}
	</div>
</div>

<SimpleFooter />
