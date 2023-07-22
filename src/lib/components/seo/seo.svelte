<script lang="ts">
  export let title: string  = 'CoatiQuati';
  export let description: string = 'Potencialize seu aprendizado compartilhando conhecimento em trilhas de estudo organizadas por profissionais.';
  export let image: string = 'https://www.coatiquati.wiki/og.png';
  export let url: string = '/';
  export let type: string = 'website';
</script>

<svelte:head>
  <!-- HTML Meta Tags -->
  <title>{title}</title>
  <meta name="description" content={description}>

  <meta property="og:url" content={"https://www.coatiquati.wiki" + url}>
  <meta property="og:type" content={type}>
  <meta property="og:title" content={title}>
  <meta property="og:description" content={description}>
  <meta property="og:image" content={image}>
  <meta property="og:locale" content="pt_BR" />

  <!-- Twitter Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta property="twitter:domain" content="coatiquati.wiki">
  <meta property="twitter:url" content={"https://www.coatiquati.wiki" + url}>
  <meta name="twitter:title" content={title}>
  <meta name="twitter:description" content={description}>
  <meta name="twitter:image" content={image}>
</svelte:head>
