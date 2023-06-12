<script lang="ts">
	export let title: string;
	export let titleClassname = '';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<section class={className}>
	<h2 class="text-2xl font-bold lc-box mt-6 mb-2 h-fit {titleClassname}">
		{title}
	</h2>

	<slot />
</section>
