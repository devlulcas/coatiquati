<script lang="ts">
	import { Pin } from 'lucide-svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<main class="container mx-auto">
	<h1 class="flex items-center gap-2 text-2xl font-bold text-gray-900 my-4">
		<Pin />
		<span>Trilhas</span>
	</h1>

	<ul class="flex flex-col">
		{#each data.breadcrumbs as breadcrumb}
			<li class="item before:bg-gray-500">
				<a href="/breadcrumbs/{breadcrumb.slug}">
					<div class="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-md hover:shadow-lg">
						<h2>
							{breadcrumb.title}
						</h2>

						<p>
							{breadcrumb.description}
						</p>
					</div>
				</a>
			</li>
		{/each}
	</ul>
</main>

<style lang="postcss">
	.item {
		border-left: 5px solid #ccc;
		padding-left: 1rem;
		padding-top: 1rem;
		padding-bottom: 1rem;
    position: relative;

		&:first-child {
			padding-top: 0;
		}

		&:last-child {
			padding-bottom: 0;
		}

		&::before {
			content: '';
			position: absolute;
			width: 15px;
			height: 15px;
			border-radius: 50%;
			
      top: 50%;
      left: -.65%;
      transform: translateY( -50%);
		}
	}
</style>
