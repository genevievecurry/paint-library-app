<script context="module" lang="ts">
  export async function load({ error, status }) {
    return {
      props: {
        error,
        status,
      },
    };
  }
</script>

<script lang="ts">
  import { session } from '$app/stores';
  import Header from '$lib/components/Header.svelte';

  export let error;
  export let status;

  const seeError = $session?.user?.role === 'ADMIN';
</script>

<svelte:head>
  <title>Uh Oh - Paint Library</title>
</svelte:head>

<div class="lg:container mx-auto px-4 sm:px-6">
  <Header title={`${status} ${error.name}`} />
  {#if seeError}
    <pre>{error.stack}</pre>
  {:else}
    <pre>{error.message}.</pre>
  {/if}
</div>
