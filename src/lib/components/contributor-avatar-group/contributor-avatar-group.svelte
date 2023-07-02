<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { Contributor } from '$modules/user/entities/contributor.entity';

	export let contributors: Contributor[] = [];

	let className: string | null | undefined;
	export { className as class };
</script>

<div class={cn('flex items-center', className)}>
	{#each contributors as avatar, index}
		<img
			loading="lazy"
			title={avatar.username}
			src={avatar.avatar}
			width={40}
			height={40}
			alt={avatar.username}
			style="z-index: {contributors.length - index}"
			class={cn(
				'transition-all duration-300 ease-in-out',
				'hover:scale-110 hover:rotate-12',
				'h-10 w-10 object-cover rounded-full border border-white/25 bg-white/95',
				index == 0 ? 'ml-0' : '-ml-2'
			)}
		/>
	{/each}
</div>
