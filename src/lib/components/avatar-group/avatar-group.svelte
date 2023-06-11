<script lang="ts">
	import type { Image } from '$lib/types/image';
	import { cn } from '$lib/utils/cn';

	type Avatar = {
		username: string;
		image: Image;
	};

	export let avatars: Avatar[] = [];

	let className: string | null | undefined;
	export { className as class };
</script>

<div class={cn('flex items-center', className)}>
	{#each avatars as avatar, index}
		<img
			loading="lazy"
			title={avatar.username}
			src={avatar.image.url}
			width={avatar.image.width}
			height={avatar.image.height}
			alt={avatar.image.alt}
			style="z-index: {avatars.length - index}"
			class={cn(
				'transition-all duration-300 ease-in-out',
				'hover:scale-110 hover:rotate-12',
				'h-10 w-10 object-cover rounded-full border-[1px] border-white/25 bg-white/75',
				index == 0 ? 'ml-0' : '-ml-2'
			)}
		/>
	{/each}
</div>
