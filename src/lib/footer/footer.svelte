<script lang="ts">
	import { Globe2 } from 'lucide-svelte';
</script>

<footer
	class="flex flex-col items-center justify-center w-full h-32 p-4 text-center text-gray-500 bg-gray-100"
>
	<p class="flex gap-1 items-center mb-3">
		<span>Created by </span>
		<a class="flex gap-2 items-center font-bold text-gray-900" href="https://www.lucasrego.tech">
			<span>Lucas Rego</span>
			<Globe2 />
		</a>
	</p>

	<p class="flex gap-1 items-center">
		<span>Source code on </span>
		<a
			class="flex gap-2 items-center font-bold text-gray-900"
			href="https://github.com/devlulcas/coati/"
		>
			GitHub
		</a>
	</p>
</footer>
