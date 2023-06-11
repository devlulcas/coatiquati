<script lang="ts">
	import '$lib/assets/styles/global.postcss';
	import { Blob } from '$lib/components/blob';
	import { Header } from '$lib/components/header';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<div
	class="fixed inset-0 select-none pointer-events-none bg-gradient-to-r from-black via-neutral-800 to-black"
>
	<div
		class="w-7/12 aspect-square rounded-full absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-600 via-fuchsia-600 to-pink-600"
	/>

	<Blob />
</div>

<Header user={data.user} />

<div
	class="grainy backdrop-blur-2xl relative max-w-[100vw] min-h-[--safe-screen-height] overflow-x-hidden"
>
	<slot />
</div>

<style>
	.grainy {
		background-image: url('/grainy.svg');
		background-size: 100px;
		background-repeat: repeat;
	}

	.grainy::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: url('/grainy.svg');
		opacity: 0.1;
		z-index: -1;
	}
</style>
