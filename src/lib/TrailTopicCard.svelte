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

<li class="item before:bg-gray-500">
	<a href="/trails/{trailSlug}/{breadcrumb.slug}">
		<div class="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-md hover:shadow-lg">
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
							<svelte:component
								this={contentLegends[content].icon}
								size={18}
								class="inline-block"
							/>
						</li>
					{/if}
				{/each}
			</ul>
		</div>
	</a>
</li>

<style lang="postcss">
	.item {
		border-left: 5px solid #ccc;
		padding-left: 1rem;
		padding-top: 1rem;
		padding-bottom: 1rem;
		position: relative;

		&:first-child {
			padding-top: 0;
		}

		&:last-child {
			padding-bottom: 0;
		}

		&::before {
			content: '';
			position: absolute;
			width: 15px;
			height: 15px;
			border-radius: 50%;

			top: 50%;
			left: -0.65%;
			transform: translateY(-50%);
		}
	}
</style>
