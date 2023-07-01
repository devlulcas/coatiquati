<script lang="ts">
	import { onMount } from 'svelte';

	let dialog: HTMLDialogElement;

	const animationsComplete = (element: HTMLDialogElement) => {
		return Promise.allSettled(element.getAnimations().map((animation) => animation.finished));
	};

	const dialogClose = async () => {
		dialog.setAttribute('inert', '');
		await animationsComplete(dialog);
	};

	const closeOnInteraction = (event: MouseEvent) => {
		const interactiveElements = [HTMLDialogElement, HTMLAnchorElement, HTMLButtonElement];

		if (interactiveElements.some((type) => event.target instanceof type)) {
			dialog.close('dismiss');
		}
	};

	onMount(() => {
		dialog.addEventListener('click', closeOnInteraction);

		return () => {
			dialog.removeEventListener('click', closeOnInteraction);
		};
	});
</script>

<button on:click={() => dialog.showModal()} class="block md:hidden focus:outline-none rounded-md">
	<span class="sr-only">Abrir menu</span>
	<span class="block w-6 h-[2px] bg-white/50 rounded-full mb-1" />
	<span class="block w-6 h-[2px] bg-white/50 rounded-full mb-1" />
	<span class="block w-6 h-[2px] bg-white/50 rounded-full mb-1" />
</button>

<dialog
	on:close={dialogClose}
	bind:this={dialog}
	class="p-0 border border-white/10 rounded-xl mb-4 w-full bg-black/50 dialog"
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

	.dialog:not([open]) {
		pointer-events: none;
		opacity: 0;
	}

	.dialog::backdrop {
		z-index: 25;
		backdrop-filter: blur(10px);
		background-color: rgba(0, 0, 0, 0.5);
		transition: backdrop-filter 2s ease;
	}

	.dialog {
		--ease-squish-3: cubic-bezier(0.6, 0.04, 0.98, 0.335);

		animation: scale-down forwards;
		animation-timing-function: var(--ease-squish-3);
	}

	.dialog[open] {
		animation: slide-in-up forwards;
	}

	@media (prefers-reduced-motion: reduce) {
		.dialog {
			animation: none;
		}
	}
</style>
