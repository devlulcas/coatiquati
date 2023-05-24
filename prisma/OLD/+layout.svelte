<script>
	import { Footer } from '$lib/footer';
	import { Header } from '$lib/header';
	import '../assets/styles/global.css';
</script>

<Header />

<div class="px-4 sm:px-6 lg:px-8 py-12" style="min-height: calc(100vh - 4rem);">
	<slot />
</div>

<Footer />
