<script lang="ts">
	import emblaCarouselSvelte from 'embla-carousel-svelte';

	const emblaConfig: any = {
		options: { loop: false }
	};
</script>

<div data-carousel="embla" use:emblaCarouselSvelte={emblaConfig}>
	<div data-carousel="embla__container" {...$$props}>
		<slot />
	</div>
</div>

<style>
	[data-carousel='embla'] {
		overflow: hidden;
		height: 100%;
	}

	[data-carousel='embla__container'] {
		display: flex;
		height: 100%;
	}
</style>
