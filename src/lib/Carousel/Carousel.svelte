<script>
	// @ts-nocheck

	import emblaCarouselSvelte from 'embla-carousel-svelte';

	let emblaApi;

	const emblaConfig = {
		options: { loop: false }
	};

	const onInit = (event) => {
		emblaApi = event.detail;
	};
</script>

<div data-carousel="embla" use:emblaCarouselSvelte={emblaConfig} on:init={onInit}>
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
