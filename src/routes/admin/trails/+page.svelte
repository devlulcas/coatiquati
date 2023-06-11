<script lang="ts">
	import { AdminSection } from '$lib/components/admin-section';
	import { Button } from '$lib/components/button';
	import { Input } from '$lib/components/input';
	import { TrailCard } from '$lib/components/trail-card';

	export let data;
</script>

<AdminSection title="Gerenciar conteúdo">
	<form class="lc-box flex flex-col gap-4" method="POST" action="?/createTrail">
		<h2 class="text-2xl font-bold">Criar trilha</h2>
		<Input variant="opaque" id="title" label="Título" name="title" />
		<Input variant="opaque" id="description" label="Descrição" name="description" />
		<Input variant="opaque" id="image" label="Imagem" name="image" />

		<!-- image drag and drop image upload area -->
		<div
			class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md bg-white/90 border-purple-300"
		>
			<div class="flex flex-col items-center justify-center w-full h-full text-center">
				<p class="text-sm font-semibold text-purple-500">
					Arraste e solte a imagem aqui ou clique para selecionar
				</p>
				<input type="file" class="hidden" />
			</div>
		</div>

		<Button type="submit">Criar</Button>
	</form>
</AdminSection>

<div class="grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2">
	{#each data.trails as trail}
		<TrailCard {trail} />
	{/each}
</div>
