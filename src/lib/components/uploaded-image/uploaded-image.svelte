<script lang="ts">
	import { Trash } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { Button } from '../button';

	export let id: string;
	export let base64: string;
	export let alt: string;
	export let width: number;
	export let height: number;

	const dispatch = createEventDispatcher();

	function onDelete() {
		dispatch('delete', id);
	}
</script>

<div style="width: {width}px; height: {height}px;" class="relative bg-gray-100 rounded-md overflow-hidden">
	<img class="absolute inset-0 w-full h-full object-cover" src={base64} {alt} {width} {height} />

	<Button
		variant="destructive"
		class="absolute top-4 right-4"
		size="icon"
		on:click={onDelete}
		title="Remover imagem"
		icon={Trash}
	/>
</div>
