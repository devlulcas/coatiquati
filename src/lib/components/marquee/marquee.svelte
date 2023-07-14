<script lang="ts">
	export let words: string[] = [];
</script>

<ul class="marquee marquee-1">
	{#each words as word}
		<li>{word}</li>
	{/each}
</ul>

<ul class="marquee marquee-2">
	{#each words as word}
		<li>{word}</li>
	{/each}
</ul>

<style>
	.marquee {
		display: flex;
		gap: 1rem;
		white-space: nowrap;
		animation: marquee 20s linear infinite;
		bottom: 0;
		left: 0;
		position: fixed;
		width: 100%;
		overflow-x: hidden;
		background: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0) 100%);
		backdrop-filter: blur(10px);
	}

	.marquee-1 {
		animation-delay: 0s;
	}

	.marquee-2 {
		left: 100%;
	}

	@keyframes marquee {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-100%);
		}
	}
</style>
