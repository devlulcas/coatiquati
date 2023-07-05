<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<pre class="bg-white/90 py-4">
  {JSON.stringify(data, null, 2)}
</pre>
