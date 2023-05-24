<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const providerAuthorizationUrl = '/api/oauth?provider=google';
</script>

<a href={providerAuthorizationUrl}>Sign in with provider</a>

<pre class="code">
  {JSON.stringify(data.user, null, 2)}
</pre>
