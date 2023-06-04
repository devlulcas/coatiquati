<script>
	import { website } from '$lib/config/client';
	import { GoogleIcon } from '../icons';
</script>

<a
	href={website.auth.google.url}
	class="bg-white text-purple-800 py-2 px-4 rounded-md flex items-center"
>
	Cadastre-se ou entre com Google
	<GoogleIcon size="1.24em" class="inline-block ml-2" />
</a>
