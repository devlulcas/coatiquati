<script lang="ts">
	import { isContentType, type Breadcrumb, type ContentType } from '$src/types/breadcrumbs';
	import { Code, Image, Link, Quote, TextCursor, Video } from 'lucide-svelte';

	export let breadcrumb: Breadcrumb;
	export let trailSlug: string;

	type Icon = typeof Code;

	type Legend = {
		icon: Icon;
		label: string;
	};

	const contentLegends: Record<ContentType, Legend> = {
		code: {
			icon: Code,
			label: 'Código'
		},
		image: {
			icon: Image,
			label: 'Imagem'
		},
		link: {
			icon: Link,
			label: 'Link'
		},
		quote: {
			icon: Quote,
			label: 'Citação'
		},
		text: {
			icon: TextCursor,
			label: 'Texto'
		},
		video: {
			icon: Video,
			label: 'Vídeo'
		}
	};
</script>

<li class="item before:bg-gray-300 after:bg-gray-300">
	<button
		on:click
		class="w-full flex flex-col gap-2 p-4 border-2 border-gray-300 bg-white rounded-lg shadow-md hover:shadow-lg"
	>
		<h2>
			{breadcrumb.title}
		</h2>

		<p>
			{breadcrumb.description}
		</p>

		<ul class="flex flex-row gap-2">
			{#each breadcrumb.availableContent as content}
				{#if isContentType(content)}
					<li title={contentLegends[content].label}>
						<svelte:component this={contentLegends[content].icon} size={18} class="inline-block" />
					</li>
				{/if}
			{/each}
		</ul>
	</button>
</li>

<style lang="postcss">
	.item {
		padding-left: 1rem;
		padding-top: 1rem;
		padding-bottom: 1rem;
		position: relative;

		&::before {
			content: '';
			position: absolute;
			width: 5px;
			height: 100%;
			top: 50%;
			transform: translateY(-50%) translateX(-500%);
		}

		&::after {
			content: '';
			position: absolute;
			width: 15px;
			height: 15px;
			border-radius: 50%;
			top: 50%;
			transform: translateY(-50%) translateX(-200%);
		}
	}
</style>
