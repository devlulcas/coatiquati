<script lang="ts">
	import blob from '$lib/assets/images/blob-hq.png';
	import { Marquee } from '$lib/components/marquee';
	import { Footprints } from 'lucide-svelte';
</script>

<div class="px-2 pt-12 max-w-5xl mx-auto text-white">
	<h1 class="text-5xl lg:text-8xl font-black">Coati! Aprenda mais ensinando.</h1>

	<p class="font-medium mt-2 max-w-2xl">
		<strong>Coati</strong> é uma plataforma de ensino colaborativo, onde você pode aprender e ensinar
		qualquer coisa. Professores criam trilhas e passam primeiro deixando migalhas de conhecimento, depois
		estudantes passam pelas trilhas aprendendo com o que existe nelas e deixando mais migalhas de conhecimento.
	</p>

	<a
		class="flex gap-2 items-center w-fit mt-8 px-4 py-2 bg-white text-purple-800 rounded-sm font-bold hover:text-fuchsia-600 transition-colors"
		href="/about"
	>
		Conheça as trilhas
		<Footprints />
	</a>

	<div class="overflow-hidden outline absolute h-[--safe-screen-height] inset-0 z-[-1]">
		<img
			class="absolute bottom-0 translate-y-1/2 right-1/2 translate-x-1/2 w-full md:w-1/2 blur-xl"
			src={blob}
			alt="blob"
		/>
	</div>

	<Marquee
		words={[
			'matemática',
			'física',
			'química',
			'biologia',
			'história',
			'geografia',
			'português',
			'inglês',
			'espanhol',
			'filosofia',
			'sociologia',
			'artes',
			'educação física',
			'programação',
			'design',
			'música',
			'dança',
			'teatro',
			'literatura',
			'economia',
			'política',
			'direito',
			'medicina',
			'enfermagem',
			'psicologia'
		]}
	/>
</div>
