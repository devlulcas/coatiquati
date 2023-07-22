<script lang="ts">
	import type { ClassName } from "$lib/types/class-name";
	import { cn } from "$lib/utils/cn";

  export let className: ClassName = '';
</script>

<h2 class={cn("text-2xl font-bold lc-box mt-6 mb-2 h-fit", className)}>
  <slot/>  
</h2>
