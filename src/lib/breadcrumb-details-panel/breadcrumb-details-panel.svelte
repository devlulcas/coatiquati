<script lang="ts">
	import type { Breadcrumb } from '$src/types/breadcrumbs';
	import type { Trail } from '$src/types/trails';
	import { Carousel } from '../carousel';

	export let trail: Trail;
	export let breadcrumb: Breadcrumb;
</script>

<article
	class="flex flex-col gap-2 h-full p-4  border-gray-300 bg-gray-300 rounded-lg shadow-md hover:shadow-lg"
>
	<section class="h-full flex flex-col">
		<h2 class="text-xl font-bold text-gray-900 my-4">Sobre a trilha</h2>
		<p class="text-gray-700">{trail.description} - {breadcrumb.title}</p>

		<Carousel.Container>
			{#each breadcrumb.availableContent as content}
				<Carousel.Item>
					{content}
				</Carousel.Item>
			{/each}
		</Carousel.Container>
	</section>

	<a
		class="block w-full text-center bg-gray-500 text-white rounded-md py-2 mt-4"
		href="/trails/{trail.slug}/{breadcrumb.slug}"
	>
		Começar
	</a>
</article>
