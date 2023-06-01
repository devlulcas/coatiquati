<script lang="ts">
	import { cn } from '$lib/utils/cn';

	export let variant: 'primary' | 'secondary' = 'primary';
</script>

<button
	{...$$restProps}
	class={cn(
		'py-2 px-3 rounded-md text-md flex items-center justify-center w-fit gap-2',
		{
			'bg-purple-800 text-white': variant === 'primary',
			'bg-white text-purple-800': variant === 'secondary'
		},
		$$restProps.class
	)}
>
	<slot />
</button>
