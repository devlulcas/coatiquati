<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let dialog: HTMLDialogElement;

	const closeOnClickedOutside = (event: MouseEvent) => {
		if (!event.target) return;
		if (!(event.target instanceof HTMLElement)) return;
		if (event.target.nodeName !== 'DIALOG') return;
		dialog.close('dismiss');
	};

	onMount(() => {
		dialog.addEventListener('click', closeOnClickedOutside);
		dialog.addEventListener('close', dialogClose);

		return () => {
			dialog.removeEventListener('click', closeOnClickedOutside);
		};
	});

	const dialogClose = async ({ target }: Event) => {
		if (!(target instanceof HTMLDialogElement)) return;
		target.setAttribute('inert', '');
		await animationsComplete(target);
	};

	const animationsComplete = (element: HTMLDialogElement) => {
		return Promise.allSettled(element.getAnimations().map((animation) => animation.finished));
	};
</script>

<button on:click={() => dialog.showModal()} class="block md:hidden focus:outline-none rounded-md">
	<span class="sr-only">Abrir menu</span>
	<span class="block w-6 h-[2px] bg-white/50 rounded-full mb-1" />
	<span class="block w-6 h-[2px] bg-white/50 rounded-full mb-1" />
	<span class="block w-6 h-[2px] bg-white/50 rounded-full mb-1" />
</button>

<dialog
	transition:fly={{ y: 100, duration: 200 }}
	bind:this={dialog}
	class="border border-white/25 rounded-md mb-4 w-full bg-black/75 backdrop:backdrop-blur-sm backdrop:bg-black/50"
>
	<slot />
</dialog>

<style lang="postcss">
	@keyframes scale-down {
		0% {
			transform: scale(1);
			opacity: 1;
		}

		100% {
			transform: scale(0.95);
			opacity: 0;
		}
	}

	@keyframes slide-in-up {
		0% {
			transform: translateY(100%);
			opacity: 0;
		}

		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}

	dialog:not([open]) {
		pointer-events: none;
		opacity: 0;
	}

	dialog::backdrop {
		transition: backdrop-filter 2s ease;
	}

	dialog {
		--ease-squish-3: cubic-bezier(0.6, 0.04, 0.98, 0.335);

		animation: scale-down forwards;
		animation-timing-function: var(--ease-squish-3);
	}

	dialog[open] {
		animation: slide-in-up forwards;
	}

	@media (prefers-reduced-motion: reduce) {
		dialog {
			animation: none;
		}
	}
</style>
