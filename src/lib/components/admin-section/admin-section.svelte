<script lang="ts">
	export let title: string;
	export let titleClassname = '';
</script>

<h2 class="text-2xl font-bold border-[1px] border-white/25 rounded-md p-4 m-2 {titleClassname}">
	{title}
</h2>

<slot />

<div class="border-[1px] border-white/25 my-6" />
