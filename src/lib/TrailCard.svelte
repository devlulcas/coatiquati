<script lang="ts">
	import type { Trail } from '$src/types/trails';

	export let data: Trail;
</script>

<a href="/trails/{data.slug}">
	<article class="w-full h-fit bg-white rounded-lg shadow-lg overflow-hidden">
		<picture>
			<img
				style="
          background-image: url({data.image.blurDataURL}); 
          background-size: cover; 
          background-position: center;
          aspect-ratio: {data.image.width}/{data.image.height};
          object-fit: cover;
          width: 100%;
          filter: grayscale(1);
        "
				loading="lazy"
				src={data.image.src}
				alt={data.image.alt}
				width={data.image.width}
				height={data.image.height}
			/>
		</picture>

		<section class="text-gray-700 p-4">
			<h2 class="text-2xl font-bold text-gray-900">{data.title}</h2>

			<p>{data.description}</p>

			<p>
				Autor: {data.author}
			</p>

			<p>{data.breadcrumbs} conteúdos</p>
		</section>
	</article>
</a>
