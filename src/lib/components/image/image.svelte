<script lang="ts">
	import { cn } from '$lib/utils/cn';

	const defaultPlaceholder =
		'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAACwAQCdASoFAAUAAkA+JbACdAEO/gLsAOIEI3Wx2AUkEtYFiLr1HTu0Rd3OysEP2ty33F/bv95oi+3cvAAAAA==';

	export let src: string;
	export let alt: string;
	export let width: string | number | undefined = undefined;
	export let height: string | number | undefined = undefined;
	export let loading: 'lazy' | 'eager' = 'lazy';
	export let placeholder: string = defaultPlaceholder;
	export let style: string | null | undefined = null;
	export let imageClass: string | null | undefined = null;

	let className: string | null | undefined = undefined;
	export { className as class };

	let isLoading = true;
</script>

<div
	style="background-image: url({placeholder}); {style}"
	class={cn(isLoading && 'image', 'overflow-hidden', className)}
>
	<img
		on:load={() => (isLoading = false)}
		{loading}
		{src}
		{alt}
		{width}
		{height}
		class={cn('h-full object-cover', imageClass)}
		{...$$restProps}
	/>
</div>

<style lang="postcss">
	div {
		position: relative;
		background-repeat: no-repeat;
		background-size: cover;
	}

	.image::after {
		filter: backdrop-blur(10px);
		content: '';
		position: absolute;
		inset: 0;
		opacity: 0;
		animation: pulse 2.5s infinite;
		background-color: white;
		z-index: 0;
	}

	.image img {
		z-index: 1;
		animation: fade-in 0.5s ease-in-out;
	}

	@keyframes pulse {
		0% {
			opacity: 0;
		}
		50% {
			opacity: 0.1;
		}
		100% {
			opacity: 0;
		}
	}
</style>
