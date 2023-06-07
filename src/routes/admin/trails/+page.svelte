<script lang="ts">
	import { AdminSection } from '$lib/components/admin-section';
	import { Button } from '$lib/components/button';
	import { Input } from '$lib/components/input';
</script>

<AdminSection title="Gerenciar conteúdo">
	<form class="lc-box flex flex-col gap-4" method="POST" action="/createTrail">
		<h2 class="text-2xl font-bold">Criar trilha</h2>
		<Input variant="opaque" id="title" label="Título" name="title" />
		<Input variant="opaque" id="description" label="Descrição" name="description" />
		<Input variant="opaque" id="image" label="Imagem" name="image" />
		<Button type="submit">Criar</Button>
	</form>
</AdminSection>
