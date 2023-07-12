<script lang="ts">
	type FormError = string[] | null | undefined;

	export let id: string;
	export let errors: FormError = null;
	export let locale = 'pt-BR';
</script>

<div class="h-4">
	{#if errors?.length}
		<p {id} aria-live="assertive" class="text-red-600 uppercase h-full text-xs font-bold rounded">
			{new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' }).format(errors)}
		</p>
	{/if}
</div>
