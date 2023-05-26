<script lang="ts">
	import { onMount } from 'svelte';
	import { MetaballsEffect } from './metaballs-effect';

	let canvas: HTMLCanvasElement;

	let effect: MetaballsEffect;

	function paintGradient(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
		const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
		gradient.addColorStop(0, '#9333ea');
		gradient.addColorStop(0.2, '#22d3ee');
		gradient.addColorStop(0.5, '#c026d3');
		gradient.addColorStop(1, '#db2777');
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	function onResize() {
		if (!canvas) return;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const ctx = canvas.getContext('2d');

		if (!ctx) return;

		paintGradient(canvas, ctx);

		effect.reset(window.innerWidth, window.innerHeight);
	}

	function animate(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
		requestAnimationFrame(() => animate(canvas, ctx));
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		effect.update();
		effect.draw(ctx);
	}

	onMount(() => {
		const ctx = canvas.getContext('2d');

		if (!canvas || !ctx) return;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		paintGradient(canvas, ctx);

		effect = new MetaballsEffect(window.innerWidth, window.innerHeight);

		effect.init(50);

		animate(canvas, ctx);
	});
</script>

<svelte:window on:resize={onResize} />

<svg>
	<defs>
		<filter id="blob-blur">
			<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
			<feColorMatrix
				in="blur"
				mode="matrix"
				values="1 0 0 0 0
                                                      0 1 0 0 0
                                                      0 0 1 0 0
                                                      0 0 0 20 -10"
				result="blob"
			/>
		</filter>
	</defs>
</svg>

<canvas
	bind:this={canvas}
	class="h-full w-full z-[-1] fixed top-0 right-0 select-none pointer-events-none"
/>

<style lang="postcss">
	canvas {
		filter: url(#blob-blur);
	}

	@media (prefers-reduced-motion: reduce) {
		canvas {
			display: none;
		}
	}
</style>
