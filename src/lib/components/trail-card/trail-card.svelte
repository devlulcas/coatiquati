<script lang="ts">
	import type { TrailPreview } from '$src/modules/trail/dtos/trail.dto';
	import { ArrowRightIcon, Edit } from 'lucide-svelte';
	import { AvatarGroup } from '../avatar-group';
	import { Button } from '../button';
	import { Image } from '../image';

	export let trail: TrailPreview;

	export let editable = false;
</script>

<article class="flex max-w-[580px] min-h-[300px] flex-1 border border-white/10 rounded-md">
	<div class="relative w-1/2 rounded-tl-md rounded-bl-md overflow-hidden">
		<Image
			src={trail.image.url}
			width={trail.image.width}
			height={trail.image.height}
			placeholder={trail.image.placeholder}
			alt={trail.title}
			class="h-full"
		/>

		<AvatarGroup avatars={trail.contributors} class="absolute bottom-0 left-0 p-4" />
	</div>

	<div
		class="relative w-1/2 flex flex-col justify-between p-4 rounded-tr-md rounded-br-md bg-white/90"
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

		<Button class="w-fit" href={trail.slug}>
			Ver mais
			<ArrowRightIcon size={18} />
		</Button>
	</div>
</article>
