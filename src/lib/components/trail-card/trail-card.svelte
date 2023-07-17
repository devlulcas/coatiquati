<script lang="ts">
	import { Button } from '$lib/components/button';
	import type { TrailPreview } from '$modules/trail/dtos/trail-preview.dto';
	import { ArrowRightIcon, Edit } from 'lucide-svelte';
	import { ContributorAvatarGroup } from '../contributor-avatar-group';

	export let trail: TrailPreview;

	export let editable = false;
</script>

<a href={trail.slug} class="relative flex flex-col w-full bg-white rounded-md overflow-clip border border-white/25">
	<ContributorAvatarGroup className="absolute top-4 right-4" contributors={trail.contributors} />

	<img class="object-cover w-full h-96 lg:h-80" src={trail.thumbnail.url} alt={trail.title} />

	<div class="p-4 h-full flex flex-col justify-between">
		<div>
			<h2 class="text-2xl font-black uppercase min-h-[2lh] line-clamp-2 break-words">{trail.title}</h2>
			<p class="mt-2 text-sm text-gray-800 w-full min-h-[4lh] line-clamp-4 break-words">{trail.description}</p>

			<time class="block mt-2 text-sm text-gray-500" datetime={trail.updatedAt}>
				Atualizado em {new Date(trail.updatedAt).toLocaleDateString()}
			</time>
		</div>

		<div class="w-full flex gap-2 mt-4">
			<Button className="w-full" href={trail.slug}>
				Ver mais
				<ArrowRightIcon size={18} />
			</Button>

			{#if editable}
				<Button size="icon" href="/admin/trails/{trail.id}" title="Editar trilha">
					<Edit size={18} />
				</Button>
			{/if}
		</div>
	</div>
</a>
