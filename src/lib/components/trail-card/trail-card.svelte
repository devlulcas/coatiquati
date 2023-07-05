<script lang="ts">
	import type { TrailPreview } from '$modules/trail/dtos/trail-preview.dto';
	import { ArrowRightIcon, Edit } from 'lucide-svelte';
	import { Button } from '../button';
	import { ContributorAvatarGroup } from '../contributor-avatar-group';
	import { Image } from '../image';

	export let trail: TrailPreview;

	export let editable = false;
</script>

<article
	class="flex flex-col md:flex-row aspect-[2/1] max-w-[600px] max-h-[300px] flex-1 border border-white/10 rounded-md"
>
	<div class="relative md:w-1/2 rounded-t-md md:rounded-tr-none md:rounded-l-md overflow-hidden">
		<Image src={trail.thumbnail.url} placeholder={trail.thumbnail.placeholder} alt={trail.title} />

		<ContributorAvatarGroup contributors={trail.contributors} class="absolute bottom-0 left-0 p-4" />
	</div>

	<div
		class="relative md:w-1/2 flex flex-col justify-between p-4 rounded-b-md md:rounded-bl-none md:rounded-r-md bg-white/90"
	>
		{#if editable}
			<Button
				size="icon"
				href="/admin/trails/{trail.id}"
				title="Editar trilha"
				class="absolute bottom-4 right-4 p-2 rounded-md bg-purple-500 bg-opacity-25 text-purple-800 hover:bg-opacity-50 hover:text-white"
			>
				<Edit size={18} />
			</Button>
		{/if}

		<div>
			<h2 class="text-2xl font-black uppercase line-clamp-2 break-words">{trail.title}</h2>
			<p class="mt-2 text-sm text-gray-800 w-full line-clamp-4 break-words">{trail.description}</p>

			<time class="block mt-2 text-sm text-gray-500" datetime={trail.updatedAt}>
				Atualizado em {new Date(trail.updatedAt).toLocaleDateString()}
			</time>
		</div>

		<Button class="w-fit mt-4" href={trail.slug}>
			Ver mais
			<ArrowRightIcon size={18} />
		</Button>
	</div>
</article>
