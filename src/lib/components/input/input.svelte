<script lang="ts">
	export let label: string;
	export let id: string;
</script>

<div class="flex flex-col gap-2 mb-4">
	<label class="font-bold text-white text-md" for={id}>{label}</label>
	<input
		{id}
		{...$$restProps}
		class={`w-full p-2 rounded-md text-white bg-white/10 border-b border-white/50 outline-none focus:border-white/80 ${$$props.class}`}
	/>
</div>
