<script lang="ts">
	import { Header } from '$lib/components/header';
	import '../assets/styles/global.css';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<div class="fixed inset-0 bg-black select-none pointer-events-none">
	<div
		class="w-7/12 aspect-square rounded-full absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-gradient-to-t from-fuchsia-600 to-pink-600"
	/>
</div>

<div class="grainy backdrop-blur-2xl relative w-screen min-h-screen overflow-x-hidden text-white">
	<Header isLoggedIn={!!data.user?.id} />

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
