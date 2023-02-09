<script lang="ts">
	import BreadcrumbDetailsPanel from '$lib/BreadcrumbDetailsPanel.svelte';
	import TrailTopicCard from '$lib/TrailTopicCard.svelte';
	import { Pin, X } from 'lucide-svelte';
	import type { PageServerData } from './$types';
	import { Dialog, DialogOverlay, DialogTitle, Transition } from '@rgossiaux/svelte-headlessui';
	import { fade } from 'svelte/transition';

	export let data: PageServerData;

	let isOpen = true;
</script>

<main class="container mx-auto">
	<div class="flex gap-2">
		<div class="w-full md:w-1/2">
			<h1 class="flex items-center gap-2 text-2xl font-bold text-gray-900 my-4">
				<Pin />
				<span>Trilhas</span>
			</h1>

			<ul class="flex flex-col">
				{#each data.breadcrumbs as breadcrumb}
					<TrailTopicCard
						on:click={() => (isOpen = true)}
						{breadcrumb}
						trailSlug={data.trail.slug}
					/>
				{/each}
			</ul>
		</div>

		<div class="hidden md:block w-1/2 relative">
			<div class="trail-details ">
				<BreadcrumbDetailsPanel trail={data.trail} breadcrumb={data.breadcrumbs[0]} />

				{#if isOpen}
					<div transition:fade>
						<Dialog
							class="fixed inset-0 z-1  0 overflow-y-auto"
							open={isOpen}
							on:close={() => (isOpen = false)}
							static
						>
							<DialogOverlay class="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity" />

							<div class="fixed inset-0 flex items-center justify-center p-2">
								<div class="h-3/5 w-full max-w-2xl relative">
									<button
										class="absolute top-0 right-0 p-2"
										on:click={() => (isOpen = false)}
										title="Fechar"
									>
										<X />
									</button>

									<BreadcrumbDetailsPanel trail={data.trail} breadcrumb={data.breadcrumbs[0]} />
								</div>
							</div>
						</Dialog>
					</div>
				{/if}
			</div>
		</div>
	</div>
</main>

<style lang="postcss">
	.trail-details {
		position: sticky;
		top: var(--header-height);
		height: calc(100vh - var(--header-height));
		padding: 1.75rem 1rem 1.75rem 1rem;
	}
</style>
