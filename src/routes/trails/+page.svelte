<script lang="ts">
	import { Badge } from '$lib/components/badge/';
	import { SimpleFooter } from '$lib/components/footer';
	import { TextField } from '$lib/components/text-field/';
	import { TrailCard, TrailCardGrid } from '$lib/components/trail-card';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="lc-wrapper min-h-[--safe-screen-height]">
	<form method="GET" class="flex flex-1 items-end mt-8">
		<TextField id="search" name="search" label="Pesquisar" variant="opaque"
      labelVariant="default"
     />
	</form>

	{#if data.error}
		<Badge variant="warning" class="mt-4">
			{data.error}
		</Badge>
	{/if}

	<TrailCardGrid>
		{#each data.trails as trail}
			<TrailCard {trail} />
		{/each}
	</TrailCardGrid>
</div>

<SimpleFooter />
